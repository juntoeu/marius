'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  SessionState,
  TranscriptEntry,
  FeedbackData,
  ConversationMode,
  SessionStatus,
} from '@/lib/types';

type SessionAction =
  | { type: 'SET_MODE'; payload: ConversationMode }
  | { type: 'SET_STATUS'; payload: SessionStatus }
  | { type: 'ADD_TRANSCRIPT_ENTRY'; payload: TranscriptEntry }
  | { type: 'SET_TRANSCRIPT'; payload: TranscriptEntry[] }
  | { type: 'SET_FEEDBACK'; payload: FeedbackData }
  | { type: 'SET_CONVERSATION_START_TIME'; payload: number }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_FOR_RETRY' }
  | { type: 'FULL_RESET' };

const initialState: SessionState = {
  mode: null,
  status: 'briefing',
  transcript: [],
  feedback: null,
  conversationStartTime: null,
  error: null,
};

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'ADD_TRANSCRIPT_ENTRY':
      return { ...state, transcript: [...state.transcript, action.payload] };
    case 'SET_TRANSCRIPT':
      return { ...state, transcript: action.payload };
    case 'SET_FEEDBACK':
      return { ...state, feedback: action.payload };
    case 'SET_CONVERSATION_START_TIME':
      return { ...state, conversationStartTime: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_FOR_RETRY':
      return {
        ...state,
        transcript: [],
        feedback: null,
        conversationStartTime: null,
        error: null,
        status: 'conversation',
      };
    case 'FULL_RESET':
      return initialState;
    default:
      return state;
  }
}

interface SessionContextValue {
  state: SessionState;
  setMode: (mode: ConversationMode) => void;
  setStatus: (status: SessionStatus) => void;
  addTranscriptEntry: (entry: TranscriptEntry) => void;
  setTranscript: (transcript: TranscriptEntry[]) => void;
  setFeedback: (feedback: FeedbackData) => void;
  setConversationStartTime: (time: number) => void;
  setError: (error: string | null) => void;
  resetForRetry: () => void;
  fullReset: () => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  const value: SessionContextValue = {
    state,
    setMode: (mode) => dispatch({ type: 'SET_MODE', payload: mode }),
    setStatus: (status) => dispatch({ type: 'SET_STATUS', payload: status }),
    addTranscriptEntry: (entry) => dispatch({ type: 'ADD_TRANSCRIPT_ENTRY', payload: entry }),
    setTranscript: (transcript) => dispatch({ type: 'SET_TRANSCRIPT', payload: transcript }),
    setFeedback: (feedback) => dispatch({ type: 'SET_FEEDBACK', payload: feedback }),
    setConversationStartTime: (time) =>
      dispatch({ type: 'SET_CONVERSATION_START_TIME', payload: time }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    resetForRetry: () => dispatch({ type: 'RESET_FOR_RETRY' }),
    fullReset: () => dispatch({ type: 'FULL_RESET' }),
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
