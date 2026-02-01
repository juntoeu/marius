'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Square } from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import { DEFAULT_SCENARIO } from '@/lib/scenarios';
import { ChatMessage as ChatMessageType } from '@/lib/types';
import Timer from './Timer';
import ChatMessage from './ChatMessage';

export default function TextConversation() {
  const { state, addTranscriptEntry, setStatus, setConversationStartTime, setError } =
    useSession();
  const scenario = DEFAULT_SCENARIO;
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with Sandra's first message
  useEffect(() => {
    if (messages.length === 0) {
      setConversationStartTime(Date.now());
      const firstMessage: ChatMessageType = {
        role: 'assistant',
        content: scenario.firstMessage,
      };
      setMessages([firstMessage]);
      addTranscriptEntry({
        role: 'agent',
        text: scenario.firstMessage,
        timestamp: Date.now(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message to UI and transcript
    const newUserMessage: ChatMessageType = { role: 'user', content: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);
    addTranscriptEntry({
      role: 'user',
      text: userMessage,
      timestamp: Date.now(),
    });

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newUserMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          systemPrompt: scenario.agentSystemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat API error');
      }

      const data = await response.json();
      const assistantMessage: ChatMessageType = {
        role: 'assistant',
        content: data.text,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      addTranscriptEntry({
        role: 'agent',
        text: data.text,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Chat error:', error);
      setError('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEndConversation = () => {
    // Check if conversation is long enough
    const minTurns = 3;
    const userTurns = state.transcript.filter((t) => t.role === 'user').length;
    if (userTurns < minTurns) {
      setError(
        'Das Gespräch war sehr kurz. Für hilfreiches Feedback brauchen wir mindestens 2-3 Minuten Gesprächsinhalt. Möchtest du es nochmal versuchen?'
      );
      return;
    }

    setStatus('analyzing');
  };

  const elapsedMinutes = state.conversationStartTime
    ? (Date.now() - state.conversationStartTime) / 60000
    : 0;
  const showProminentEnd = elapsedMinutes >= 2;

  return (
    <div className="min-h-screen bg-[var(--junto-dark)] flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <span className="text-xl font-bold text-white">junto</span>
        <div className="text-center">
          <p className="text-white font-medium">{scenario.personaName}</p>
          <p className="text-white/60 text-sm">{scenario.personaRole}</p>
        </div>
        <Timer
          startTime={state.conversationStartTime}
          softLimitMinutes={scenario.softTimerMinutes}
        />
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role === 'assistant' ? 'agent' : 'user'}
              text={message.content}
            />
          ))}
          {isLoading && <ChatMessage role="agent" text="" isTyping />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="px-6 py-4 border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3 mb-4">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Deine Antwort…"
              disabled={isLoading}
              className="flex-1 bg-[var(--junto-dark-light)] text-white placeholder-white/40 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--junto-yellow)] disabled:opacity-50"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-[var(--junto-yellow)] text-[var(--junto-dark)] p-3 rounded-xl disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEndConversation}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-all text-sm ${
                showProminentEnd
                  ? 'bg-[var(--coral)] text-white'
                  : 'border border-white/30 text-white/70 hover:text-white hover:border-white/50'
              }`}
            >
              <Square className="w-3 h-3" />
              Gespräch beenden
            </motion.button>
          </div>
        </div>
      </footer>

      {/* Error Modal */}
      {state.error && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--card-bg)] rounded-xl p-6 max-w-md w-full"
          >
            <p className="text-[var(--foreground)] mb-6">{state.error}</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setError(null);
                }}
                className="flex-1 bg-[var(--junto-yellow)] text-[var(--junto-dark)] font-medium py-3 rounded-lg"
              >
                Weiter schreiben
              </button>
              <button
                onClick={() => setStatus('mode-select')}
                className="flex-1 border border-[var(--card-border)] text-[var(--foreground)] font-medium py-3 rounded-lg"
              >
                Modus wechseln
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
