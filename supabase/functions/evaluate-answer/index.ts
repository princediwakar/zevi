import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MAX_QUESTION_LENGTH = 5000;
const MAX_USER_ANSWER_LENGTH = 10000;
const MAX_EXPERT_ANSWER_LENGTH = 5000;
const TIMEOUT_MS = 30000;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = Date.now();
  const requestId = crypto.randomUUID();

  try {
    // Parse request body
    const { question, userAnswer, expertAnswer, rubric } = await req.json();

    // Input validation
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      throw new Error('Question is required and must be a non-empty string');
    }
    if (question.length > MAX_QUESTION_LENGTH) {
      throw new Error(`Question must not exceed ${MAX_QUESTION_LENGTH} characters`);
    }
    if (!userAnswer || typeof userAnswer !== 'string' || userAnswer.trim().length === 0) {
      throw new Error('User answer is required and must be a non-empty string');
    }
    if (userAnswer.length > MAX_USER_ANSWER_LENGTH) {
      throw new Error(`User answer must not exceed ${MAX_USER_ANSWER_LENGTH} characters`);
    }

    const finalExpertAnswer = expertAnswer && expertAnswer.trim()
      ? expertAnswer
      : 'No expert answer provided. Evaluate based on structure, clarity, and completeness.';

    if (finalExpertAnswer.length > MAX_EXPERT_ANSWER_LENGTH) {
      throw new Error(`Expert answer must not exceed ${MAX_EXPERT_ANSWER_LENGTH} characters`);
    }

    const finalRubric = rubric || {
      "structure": { "weight": 0.3, "criteria": ["Clear structure", "Logical flow", "Organized points"] },
      "depth": { "weight": 0.3, "criteria": ["In-depth analysis", "Specific examples", "Data-driven"] },
      "completeness": { "weight": 0.2, "criteria": ["All aspects covered", "Comprehensive", "No gaps"] },
      "clarity": { "weight": 0.2, "criteria": ["Clear communication", "Concise", "Easy to understand"] }
    };

    // Optional auth — verify user if token provided (for rate limiting), but don't block
    let userId: string | null = null;
    try {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '').trim();
        // Only try to verify if it looks like a JWT (has 3 dot-separated parts)
        if (token.split('.').length === 3) {
          const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
          );
          const { data: { user } } = await supabaseAdmin.auth.getUser(token);
          userId = user?.id ?? null;
        }
      }
    } catch (_authErr) {
      // Auth failed — continue without userId (unauthenticated request)
      console.log('Auth check failed, continuing without user context');
    }

    // API keys — DeepSeek primary, OpenAI fallback
    const deepseekKey = Deno.env.get('DEEPSEEK_API_KEY');
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!deepseekKey && !openaiKey) {
      throw new Error('No AI API key configured. Set DEEPSEEK_API_KEY or OPENAI_API_KEY.');
    }

    const prompt = `You are an expert Product Manager interviewer. Evaluate this PM interview answer.

Question: ${question}
Expert Answer (Reference): ${finalExpertAnswer}
Rubric: ${JSON.stringify(finalRubric)}

User's Answer: ${userAnswer}

Provide feedback in strict JSON format with the following structure:
{
  "score": number (1-10),
  "strengths": ["string", "string"],
  "improvements": ["string", "string"],
  "expertHighlights": ["string", "string"],
  "recommendedPractice": "string"
}

Do not add any markdown formatting or explanations outside the JSON.`;

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), TIMEOUT_MS);

    let response: Response | null = null;
    let usedProvider = '';

    try {
      if (deepseekKey) {
        // Primary: DeepSeek (OpenAI-compatible API)
        usedProvider = 'deepseek';
        response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${deepseekKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }],
          }),
          signal: abortController.signal,
        });

        // If DeepSeek fails, fall back to OpenAI
        if (!response.ok && openaiKey) {
          console.log(`DeepSeek returned ${response.status}, falling back to OpenAI`);
          usedProvider = 'openai-fallback';
          response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openaiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              max_tokens: 1024,
              messages: [{ role: 'user', content: prompt }],
            }),
            signal: abortController.signal,
          });
        }
      } else if (openaiKey) {
        usedProvider = 'openai';
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }],
          }),
          signal: abortController.signal,
        });
      }

      clearTimeout(timeoutId);

      if (!response || !response.ok) {
        const errorData = response ? await response.json().catch(() => ({})) : {};
        throw new Error(errorData.error?.message || `AI API error: HTTP ${response?.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || 'AI API Error');
      }

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from AI API');
      }

      // Strip markdown fences if model wraps JSON
      const cleanJson = content.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
      const feedback = JSON.parse(cleanJson);

      const duration = Date.now() - startTime;
      console.log(JSON.stringify({
        requestId,
        userId,
        provider: usedProvider,
        timestamp: new Date().toISOString(),
        durationMs: duration,
        status: 'success',
      }));

      return new Response(
        JSON.stringify(feedback),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );

    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error(`Request timeout after ${TIMEOUT_MS}ms`);
      }
      throw fetchError;
    }

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(JSON.stringify({
      requestId,
      timestamp: new Date().toISOString(),
      durationMs: duration,
      status: 'error',
      error: error.message,
    }));

    let statusCode = 400;
    if (error.message.includes('timeout')) statusCode = 504;

    return new Response(
      JSON.stringify({
        error: error.message,
        message: 'Failed to evaluate answer. Please try again.',
        requestId,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: statusCode },
    );
  }
})
