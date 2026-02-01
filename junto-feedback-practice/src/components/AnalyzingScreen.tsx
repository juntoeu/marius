'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/context/SessionContext';
import { DEFAULT_SCENARIO } from '@/lib/scenarios';
import { FeedbackData } from '@/lib/types';

const TIPS = [
  'Feedback sagt mehr über den Feedbackgeber aus als über den Feedbacknehmer.',
  'Wir wachsen am stärksten in den Bereichen, in denen wir bereits fähig sind.',
  'Eine gute Bitte lässt dem Gegenüber immer echten Raum für Nein.',
  '"Ich fühle mich im Stich gelassen" klingt nach Gefühl — ist aber eine Bewertung.',
  'Momente individueller Exzellenz sichtbar machen — das ist die Aufgabe einer Führungskraft.',
];

export default function AnalyzingScreen() {
  const { state, setFeedback, setStatus, setError } = useSession();
  const scenario = DEFAULT_SCENARIO;
  const [currentTip, setCurrentTip] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const hasStartedFetch = useRef(false);

  // Rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % TIPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch feedback
  useEffect(() => {
    if (hasStartedFetch.current) return;
    hasStartedFetch.current = true;

    const fetchFeedback = async () => {
      try {
        // Format transcript
        const transcriptText = state.transcript
          .map((entry) =>
            entry.role === 'user'
              ? `Führungskraft: ${entry.text}`
              : `Sandra: ${entry.text}`
          )
          .join('\n\n');

        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: transcriptText }),
        });

        if (!response.ok) {
          throw new Error('Feedback API error');
        }

        const data: FeedbackData = await response.json();
        setFeedback(data);
        setStatus('feedback');
      } catch (error) {
        console.error('Feedback error:', error);
        if (retryCount < 1) {
          setRetryCount((prev) => prev + 1);
          hasStartedFetch.current = false;
        } else {
          setError(
            'Das Feedback konnte nicht generiert werden. Bitte versuche es erneut.'
          );
        }
      }
    };

    fetchFeedback();
  }, [state.transcript, setFeedback, setStatus, setError, retryCount]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Animated Dimensions */}
        <div className="flex justify-center gap-3 mb-10">
          {scenario.dimensions.map((dimension, index) => (
            <motion.div
              key={dimension.id}
              className="w-4 h-4 rounded-full bg-[var(--card-border)]"
              animate={{
                scale: [1, 1.5, 1],
                backgroundColor: [
                  'var(--card-border)',
                  'var(--junto-yellow)',
                  'var(--card-border)',
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Loading Text */}
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-8">
          Dein Feedback wird analysiert…
        </h2>

        {/* Rotating Tips */}
        <div className="h-20">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTip}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-[var(--foreground-light)] italic"
            >
              „{TIPS[currentTip]}"
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Error State */}
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <p className="text-[var(--coral)] mb-4">{state.error}</p>
            <button
              onClick={() => {
                setError(null);
                setRetryCount(0);
                hasStartedFetch.current = false;
              }}
              className="bg-[var(--junto-yellow)] text-[var(--junto-navy)] font-medium px-6 py-3 rounded-xl"
            >
              Erneut versuchen
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
