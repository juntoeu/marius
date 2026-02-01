'use client';

import { motion } from 'framer-motion';
import { DEFAULT_SCENARIO } from '@/lib/scenarios';

interface ChatMessageProps {
  role: 'user' | 'agent';
  text: string;
  isTyping?: boolean;
}

export default function ChatMessage({ role, text, isTyping = false }: ChatMessageProps) {
  const scenario = DEFAULT_SCENARIO;
  const isAgent = role === 'agent';

  if (isTyping) {
    return (
      <div className="flex gap-3 items-start">
        <div className="w-10 h-10 rounded-full bg-[#5B7BA0] flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
          {scenario.personaInitials}
        </div>
        <div className="bg-[var(--junto-navy-light)] rounded-2xl rounded-tl-md px-4 py-3">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-white/50 rounded-full typing-dot" />
            <span className="w-2 h-2 bg-white/50 rounded-full typing-dot" />
            <span className="w-2 h-2 bg-white/50 rounded-full typing-dot" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isAgent ? 'items-start' : 'items-start flex-row-reverse'}`}
    >
      {isAgent && (
        <div className="w-10 h-10 rounded-full bg-[#5B7BA0] flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
          {scenario.personaInitials}
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isAgent
            ? 'bg-[var(--junto-navy-light)] text-white rounded-tl-md'
            : 'bg-[var(--teal)] text-white rounded-tr-md'
        }`}
      >
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
}
