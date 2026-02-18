import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Maximum lengths for input validation
const MAX_QUESTION_LENGTH = 5000;
const MAX_USER_ANSWER_LENGTH = 10000;
const MAX_EXPERT_ANSWER_LENGTH = 5000;
const MAX_RUBRIC_LENGTH = 5000;

// Timeout settings (30 seconds)
const TIMEOUT_MS = 30000;

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = Date.now();
  let userId: string | null = null;
  let requestId = crypto.randomUUID();

  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Create Supabase client to verify the user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify token and get user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Invalid or expired authentication token');
    }
    userId = user.id;

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

    const finalExpertAnswer = expertAnswer || 'No expert answer provided. Evaluate based on structure, clarity, and completeness.';
    if (finalExpertAnswer.length > MAX_EXPERT_ANSWER_LENGTH) {
      throw new Error(`Expert answer must not exceed ${MAX_EXPERT_ANSWER_LENGTH} characters`);
    }

    const finalRubric = rubric || {
      "structure": { "weight": 0.3, "criteria": ["Clear structure", "Logical flow", "Organized points"] },
      "depth": { "weight": 0.3, "criteria": ["In-depth analysis", "Specific examples", "Data-driven"] },
      "completeness": { "weight": 0.2, "criteria": ["All aspects covered", "Comprehensive", "No gaps"] },
      "clarity": { "weight": 0.2, "criteria": ["Clear communication", "Concise", "Easy to understand"] }
    };

    if (JSON.stringify(finalRubric).length > MAX_RUBRIC_LENGTH) {
      throw new Error(`Rubric must not exceed ${MAX_RUBRIC_LENGTH} characters when stringified`);
    }

    // Check rate limit (non-blocking)
    try {
      const { data: rateLimitData } = await supabaseClient
        .rpc('check_rate_limit', { p_user_id: userId, p_endpoint: 'evaluate-answer' });
      if (rateLimitData === false) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message: 'You can only make 5 requests per minute. Please try again later.',
            retryAfter: 60
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
        );
      }
    } catch (_) {
      // Continue without rate limiting if check fails
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

    // API keys — DeepSeek primary, OpenAI fallback
    const deepseekKey = Deno.env.get('DEEPSEEK_API_KEY');
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!deepseekKey && !openaiKey) {
      throw new Error('No AI API key configured. Set DEEPSEEK_API_KEY or OPENAI_API_KEY.');
    }

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

        // If DeepSeek fails, try OpenAI fallback
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
        // No DeepSeek key — use OpenAI directly
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
      userId,
      timestamp: new Date().toISOString(),
      durationMs: duration,
      status: 'error',
      error: error.message,
    }));

    let statusCode = 400;
    if (error.message.includes('Rate limit exceeded')) statusCode = 429;
    else if (error.message.includes('timeout')) statusCode = 504;
    else if (error.message.includes('Missing authorization') || error.message.includes('Invalid')) statusCode = 401;

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
