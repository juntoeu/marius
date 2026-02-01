'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MessageSquare, AlertCircle } from 'lucide-react';
import { useSession } from '@/context/SessionContext';

export default function ModeSelectScreen() {
  const { setMode, setStatus } = useSession();
  const [micError, setMicError] = useState<string | null>(null);
  const [isCheckingMic, setIsCheckingMic] = useState(false);

  const handleVoiceSelect = async () => {
    setIsCheckingMic(true);
    setMicError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMode('voice');
      setStatus('conversation');
    } catch {
      setMicError(
        'Mikrofon-Zugriff verweigert. Bitte erlaube den Zugriff in deinen Browser-Einstellungen oder nutze den Text-Modus.'
      );
    } finally {
      setIsCheckingMic(false);
    }
  };

  const handleTextSelect = () => {
    setMode('text');
    setStatus('conversation');
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center px-6 py-4">
        <span className="text-xl font-bold text-[var(--foreground)]">junto</span>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] text-center mb-10">
            Wie möchtest du das Gespräch führen?
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Voice Card */}
            <motion.button
              whileHover={{ scale: 1.02, borderColor: 'var(--junto-yellow)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVoiceSelect}
              disabled={isCheckingMic}
              className="bg-[var(--card-bg)] rounded-xl p-8 border-2 border-[var(--card-border)] hover:border-[var(--junto-yellow)] transition-colors text-left flex flex-col items-center disabled:opacity-50"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--junto-off-yellow)] flex items-center justify-center mb-6">
                <Mic className="w-8 h-8 text-[var(--junto-yellow)]" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                Per Sprache
              </h2>
              <p className="text-sm text-[var(--foreground-light)] text-center">
                Sprich mit Sandra wie in einem echten Gespräch. Du brauchst ein
                Mikrofon und eine ruhige Umgebung.
              </p>
            </motion.button>

            {/* Text Card */}
            <motion.button
              whileHover={{ scale: 1.02, borderColor: 'var(--junto-yellow)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTextSelect}
              className="bg-[var(--card-bg)] rounded-xl p-8 border-2 border-[var(--card-border)] hover:border-[var(--junto-yellow)] transition-colors text-left flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--junto-off-yellow)] flex items-center justify-center mb-6">
                <MessageSquare className="w-8 h-8 text-[var(--junto-yellow)]" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                Per Text
              </h2>
              <p className="text-sm text-[var(--foreground-light)] text-center">
                Schreibe mit Sandra im Chat. Ideal, wenn du unterwegs bist oder
                im Büro sitzt.
              </p>
            </motion.button>
          </div>

          {/* Mic Error */}
          {micError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-[var(--coral)]/10 border border-[var(--coral)]/20 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-[var(--coral)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[var(--foreground)]">{micError}</p>
                <button
                  onClick={handleTextSelect}
                  className="text-sm text-[var(--teal)] font-medium mt-2 hover:underline"
                >
                  Stattdessen per Text chatten
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
