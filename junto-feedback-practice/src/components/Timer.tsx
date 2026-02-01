'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimerProps {
  startTime: number | null;
  softLimitMinutes: number;
  className?: string;
}

export default function Timer({ startTime, softLimitMinutes, className = '' }: TimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const isWarning = minutes >= softLimitMinutes - 1; // Yellow at 4 min
  const isOverTime = minutes >= softLimitMinutes; // Show hint at 5 min

  return (
    <div className={`flex flex-col items-end ${className}`}>
      <span
        className={`font-mono text-lg transition-colors duration-300 ${
          isWarning ? 'text-[var(--junto-yellow)]' : 'text-white/80'
        }`}
      >
        {formattedTime}
      </span>
      <AnimatePresence>
        {isOverTime && (
          <motion.span
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs text-[var(--junto-yellow)] mt-1"
          >
            Du kannst das Gespräch jetzt abrunden.
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
