import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Timeout settings (60 seconds for transcription)
const TIMEOUT_MS = 60000;

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = Date.now();
  const requestId = crypto.randomUUID();

  try {
    // Verify API key from request
    const apiKey = req.headers.get('apikey');
    if (!apiKey) {
      throw new Error('Missing API key');
    }

    // Get the audio data from request body
    const { audioBase64, fileType } = await req.json();

    if (!audioBase64 || typeof audioBase64 !== 'string') {
      throw new Error('Audio base64 is required');
    }

    // Determine file type
    const audioFileType = fileType || 'm4a';

    // Retrieve OpenAI API Key from environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Create AbortController for timeout
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), TIMEOUT_MS);

    try {
      // Call OpenAI Whisper API for transcription with base64 audio
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: createFormData(audioBase64, audioFileType),
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.text) {
        throw new Error('No transcription returned from API');
      }

      const transcription = data.text.trim();

      // Log successful request
      const duration = Date.now() - startTime;
      console.log(JSON.stringify({
        requestId,
        timestamp: new Date().toISOString(),
        durationMs: duration,
        status: 'success',
        transcriptionLength: transcription.length,
      }));

      return new Response(
        JSON.stringify({ transcription }),
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
      timestamp: new Date().toISOString(),
      durationMs: duration,
      status: 'error',
      error: error.message,
      stack: error.stack
    }));

    // Determine appropriate status code
    let statusCode = 400;
    let errorMessage = error.message;

    if (error.message.includes('Missing API key')) {
      statusCode = 401;
    } else if (error.message.includes('timeout')) {
      statusCode = 504;
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        message: 'Failed to transcribe audio. Please check your input and try again.',
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

// Helper function to create FormData with base64 audio
function createFormData(base64Audio: string, fileType: string): FormData {
  // Convert base64 to binary
  const binaryString = atob(base64Audio);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const blob = new Blob([bytes], { type: `audio/${fileType}` });
  const formData = new FormData();
  formData.append('file', blob, `recording.${fileType}`);
  formData.append('model', 'whisper-1');
  formData.append('language', 'en');
  formData.append('response_format', 'json');
  
  return formData;
}
