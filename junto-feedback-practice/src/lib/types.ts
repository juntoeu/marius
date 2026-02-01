export interface TranscriptEntry {
  role: 'user' | 'agent';
  text: string;
  timestamp: number;
}

export interface DimensionScore {
  score: number;
  begruendung: string;
}

export interface FeedbackLike {
  text: string;
  zitat: string;
}

export interface FeedbackImprovement {
  text: string;
  zitat: string;
  alternative: string;
}

export interface FeedbackData {
  gesamtscore: number;
  headline: string;
  likes: FeedbackLike[];
  verbesserungen: FeedbackImprovement[];
  dimensionen: {
    beobachtung: DimensionScore;
    gefuehl: DimensionScore;
    beduerfnis: DimensionScore;
    bitte: DimensionScore;
    empathische_praesenz: DimensionScore;
  };
  key_takeaway: string;
}

export type ConversationMode = 'voice' | 'text' | null;

export type SessionStatus =
  | 'briefing'
  | 'mode-select'
  | 'conversation'
  | 'analyzing'
  | 'feedback';

export interface SessionState {
  mode: ConversationMode;
  status: SessionStatus;
  transcript: TranscriptEntry[];
  feedback: FeedbackData | null;
  conversationStartTime: number | null;
  error: string | null;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
