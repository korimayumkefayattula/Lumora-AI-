import { VoiceMessage, SupportedLanguage } from '../types/voice';

export interface AITutorChatRequest {
  question: string;
  history: VoiceMessage[];
  language: SupportedLanguage;
  responseLength: 'concise' | 'balanced' | 'detailed';
  subjectContext?: string;
  documentContext?: string;
}

export interface AITutorChatResponse {
  answer: string;
  suggestedFollowups?: string[];
}

export class AITutorService {
  public static async askQuestion(request: AITutorChatRequest): Promise<AITutorChatResponse> {
    try {
      const res = await fetch('/api/voice-tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: request.question,
          history: request.history.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          language: request.language,
          responseLength: request.responseLength,
          subjectContext: request.subjectContext,
          documentContext: request.documentContext,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || 'Failed to get answer from Lumora AI');
      }

      const data = await res.json();
      return {
        answer: data.answer || "I'm sorry, I couldn't process that question right now. Could you please try again?",
        suggestedFollowups: data.suggestedFollowups || [],
      };
    } catch (err: any) {
      console.error('AITutorService error:', err);
      throw err;
    }
  }
}
