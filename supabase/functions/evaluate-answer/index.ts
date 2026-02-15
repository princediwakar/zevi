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

// Rate limit settings
const RATE_LIMIT_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MINUTES = 1;

// Timeout settings (30 seconds)
const TIMEOUT_MS = 30000;

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Start timer for logging
  const startTime = Date.now();
  let userId: string | null = null;
  let requestId = crypto.randomUUID();

  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Create Supabase client with the provided token
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

    if (!expertAnswer || typeof expertAnswer !== 'string' || expertAnswer.trim().length === 0) {
      throw new Error('Expert answer is required and must be a non-empty string');
    }
    if (expertAnswer.length > MAX_EXPERT_ANSWER_LENGTH) {
      throw new Error(`Expert answer must not exceed ${MAX_EXPERT_ANSWER_LENGTH} characters`);
    }

    if (!rubric || typeof rubric !== 'object') {
      throw new Error('Rubric is required and must be a valid JSON object');
    }
    if (JSON.stringify(rubric).length > MAX_RUBRIC_LENGTH) {
      throw new Error(`Rubric must not exceed ${MAX_RUBRIC_LENGTH} characters when stringified`);
    }


    // Check rate limit
    const { data: rateLimitData, error: rateLimitError } = await supabaseClient
      .rpc('check_rate_limit', { p_user_id: userId, p_endpoint: 'evaluate-answer' });

    if (rateLimitError) {
      console.error('Rate limit check failed:', rateLimitError);
      // Continue without rate limiting if check fails
    } else if (rateLimitData === false) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `You can only make ${RATE_LIMIT_REQUESTS} requests per minute. Please try again later.`,
          retryAfter: 60
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429
        }
      );
    }

    // Retrieve OpenRouter API Key from environment variables
    const apiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not set');
    }

    const prompt = `
    You are an expert Product Manager interviewer. Evaluate this PM interview answer.

    Question: ${question}
    Expert Answer (Reference): ${expertAnswer}
    Rubric: ${JSON.stringify(rubric)}

    User's Answer: ${userAnswer}

    Provide feedback in strict JSON format with the following structure:
    {
      "score": number (1-10),
      "strengths": ["string", "string"],
      "improvements": ["string", "string"],
      "expertHighlights": ["string", "string"],
      "recommendedPractice": "string"
    }

    Do not add any markdown formatting or explanations outside the JSON.
    `;

    // Create AbortController for timeout
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), TIMEOUT_MS);

    try {
      const response = await fetch('https://openrouter.ai/api', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'z-z-ai/glm-4.5-air:free', // Updated to latest model
          max_tokens: 1024,
          messages: [
            { role: 'user', content: prompt }
          ],
        }),
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || 'Anthropic API Error');
      }

      const content = data.content[0]?.text;
      if (!content) {
        throw new Error('No response content from Anthropic API');
      }

      // Basic cleanup if model adds markdown fence
      const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
      const feedback = JSON.parse(cleanJson);

      // Log successful request
      const duration = Date.now() - startTime;
      console.log(JSON.stringify({
        requestId,
        userId,
        timestamp: new Date().toISOString(),
        durationMs: duration,
        status: 'success',
        questionLength: question.length,
        userAnswerLength: userAnswer.length,
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
    // Log error
    const duration = Date.now() - startTime;
    console.error(JSON.stringify({
      requestId,
      userId,
      timestamp: new Date().toISOString(),
      durationMs: duration,
      status: 'error',
      error: error.message,
      stack: error.stack
    }));

    // Determine appropriate status code
    let statusCode = 400;
    let errorMessage = error.message;

    if (error.message.includes('Rate limit exceeded')) {
      statusCode = 429;
    } else if (error.message.includes('timeout')) {
      statusCode = 504;
    } else if (error.message.includes('Missing authorization') || error.message.includes('Invalid token')) {
      statusCode = 401;
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        message: 'Failed to evaluate answer. Please check your input and try again.',
        requestId,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: statusCode
      },
    );
  }
})
