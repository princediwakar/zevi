import { Question, FrameworkEvaluationRubric, AIFrameworkAnalysis, UserOutline } from '../types';
import { FRAMEWORKS } from '../data/frameworks';

// Convert UserOutline to string representation for AI evaluation
const outlineToString = (outline: UserOutline): string => {
  return Object.entries(outline)
    .map(([section, points]) => `${section}:\n${points.map(p => `  • ${p}`).join('\n')}`)
    .join('\n\n');
};

interface AIRequest {
  question: string;
  framework_name: string;
  framework_steps: string[];
  expert_outline: Record<string, string[]>;
  evaluation_rubric: FrameworkEvaluationRubric;
  user_answer: string | UserOutline;
}

interface AIResponse {
  overall_score: number;
  framework_analysis: Record<string, {
    score: number;
    feedback: string;
    strengths: string[];
    missing: string[];
  }>;
  structure_score: number;
  depth_score: number;
  completeness_score: number;
  key_strengths: string[];
  key_improvements: string[];
  next_practice: string[];
}

export class AIFeedbackService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = 'https://openrouter.ai/api/v1';
    this.apiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '';
  }

  async analyzeFrameworkAnswer(request: AIRequest): Promise<AIResponse> {
    const framework = FRAMEWORKS[request.framework_name as keyof typeof FRAMEWORKS];
    const userAnswerText = typeof request.user_answer === 'string'
      ? request.user_answer
      : outlineToString(request.user_answer);

    const prompt = `
You are an expert product manager interview coach. Analyze the user's answer to a ${request.framework_name} framework question.

**Question:** ${request.question}
**Framework:** ${request.framework_name}
**Expected Steps:** ${request.framework_steps.join(', ')}
**Expert Outline:** ${JSON.stringify(request.expert_outline, null, 2)}

**User's Answer:**
${userAnswerText}

Evaluation Rubric:
${JSON.stringify(request.evaluation_rubric, null, 2)}

Please analyze the user's answer and return a JSON object with the following structure:
{
  "overall_score": 7.5,
  "framework_analysis": {
    "step_name": {
      "score": 8,
      "feedback": "Specific feedback about this step",
      "strengths": ["What they did well"],
      "missing": ["What they missed"]
    }
  },
  "structure_score": 8,
  "depth_score": 6,
  "completeness_score": 7,
  "key_strengths": ["Overall strengths"],
  "key_improvements": ["Areas to improve"],
  "next_practice": ["Recommended practice topics"]
}

Scoring Guidelines:
- Score each step from 1-10 based on the rubric weights
- Overall score is weighted average of step scores
- Structure: How well they followed the framework (1-10)
- Depth: How deep their analysis was (1-10)
- Completeness: Did they cover all necessary aspects (1-10)

Be specific, constructive, and actionable in your feedback.
`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://zevi.app',
          'X-Title': 'Zevi PM Interview Prep'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-5-sonnet-20241022',
          messages: [
            {
              role: 'system',
              content: 'You are an expert product manager interview coach specializing in framework analysis.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse: AIResponse = JSON.parse(data.choices[0].message.content);

      // Transform the response to match our expected format
      return {
        ...aiResponse,
        framework_analysis: this.transformFrameworkAnalysis(aiResponse.framework_analysis, request.framework_steps)
      };
    } catch (error) {
      console.error('AI Analysis Error:', error);
      // Return fallback analysis
      return this.generateFallbackAnalysis(request);
    }
  }

  private transformFrameworkAnalysis(
    analysis: any,
    steps: string[]
  ): Record<string, {
    score: number;
    feedback: string;
    strengths: string[];
    missing: string[];
  }> {
    const result: Record<string, any> = {};

    steps.forEach(step => {
      if (analysis[step]) {
        result[step] = analysis[step];
      } else {
        result[step] = {
          score: 5, // Default score
          feedback: `No specific feedback for ${step}`,
          strengths: [],
          missing: []
        };
      }
    });

    return result;
  }

  private generateFallbackAnalysis(request: AIRequest): AIResponse {
    // Basic analysis based on keyword matching
    const framework = FRAMEWORKS[request.framework_name as keyof typeof FRAMEWORKS];
    let totalScore = 0;
    const frameworkAnalysis: Record<string, { score: number; feedback: string; strengths: string[]; missing: string[]; }> = {};
    const userAnswerText = typeof request.user_answer === 'string'
      ? request.user_answer
      : outlineToString(request.user_answer);

    request.framework_steps.forEach(step => {
      const stepKeywords = framework.steps.find(s => s.name === step)?.key_points || [];
      let score = 5; // Base score

      // Simple keyword matching
      const matchedKeywords = stepKeywords.filter(keyword =>
        userAnswerText.toLowerCase().includes(keyword.toLowerCase())
      );

      score = Math.min(10, 3 + (matchedKeywords.length / stepKeywords.length) * 7);
      const roundedScore = Math.round(score);
      frameworkAnalysis[step] = {
        score: roundedScore,
        feedback: matchedKeywords.length > 0 ? `Found ${matchedKeywords.length} relevant keywords` : 'Missing key concepts',
        strengths: matchedKeywords.length > 0 ? [`Matched keywords: ${matchedKeywords.join(', ')}`] : [],
        missing: stepKeywords.filter(k => !matchedKeywords.includes(k)).slice(0, 3)
      };
      totalScore += score;
    });

    const avgScore = Math.round(totalScore / request.framework_steps.length);

    return {
      overall_score: avgScore,
      framework_analysis: frameworkAnalysis,
      structure_score: avgScore,
      depth_score: Math.max(1, avgScore - 1),
      completeness_score: avgScore,
      key_strengths: ['Good attempt at using the framework'],
      key_improvements: ['Be more specific with examples', 'Include more data points'],
      next_practice: [request.framework_name.toLowerCase().replace('_', ' ')]
    };
  }

  // Cache key for identical answers
  private generateCacheKey(questionId: string, answer: string): string {
    const hash = require('crypto')
      .createHash('md5')
      .update(`${questionId}-${answer.substring(0, 100)}`)
      .digest('hex');
    return hash;
  }

  // Check cache first
  async getCachedAnalysis(questionId: string, answer: string): Promise<AIResponse | null> {
    // Implementation for caching would go here
    // For now, return null to always call AI
    return null;
  }
}

export const aiFeedbackService = new AIFeedbackService();