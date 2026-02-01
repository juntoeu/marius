'use client';

import { motion } from 'framer-motion';
import { RotateCcw, ArrowLeft } from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import ScoreHero from './ScoreHero';
import DimensionsOverview from './DimensionsOverview';
import { LikeCards, ImprovementCards } from './FeedbackCards';
import KeyTakeaway from './KeyTakeaway';

export default function FeedbackScreen() {
  const { state, resetForRetry, setStatus } = useSession();
  const feedback = state.feedback;

  if (!feedback) {
    return null;
  }

  // Calculate duration
  const durationMs = state.conversationStartTime
    ? Date.now() - state.conversationStartTime
    : 0;
  const durationMinutes = Math.floor(durationMs / 60000);
  const durationSeconds = Math.floor((durationMs % 60000) / 1000);
  const durationString = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')} Min`;

  // Format date
  const dateString = new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const handleRetry = () => {
    resetForRetry();
  };

  const handleBackToBriefing = () => {
    setStatus('briefing');
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto">
        <span className="text-xl font-bold text-[var(--foreground)]">junto</span>
        <span className="text-sm text-[var(--foreground-light)]">
          Deine Auswertung
        </span>
      </header>

      {/* Hero Score Section */}
      <ScoreHero
        score={feedback.gesamtscore}
        headline={feedback.headline}
        date={dateString}
        duration={durationString}
      />

      {/* Dimensions Overview */}
      <DimensionsOverview feedback={feedback} />

      {/* Like Cards */}
      <LikeCards likes={feedback.likes} />

      {/* Improvement Cards */}
      <ImprovementCards improvements={feedback.verbesserungen} />

      {/* Key Takeaway */}
      <KeyTakeaway takeaway={feedback.key_takeaway} />

      {/* CTA Section */}
      <section className="py-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRetry}
            className="inline-flex items-center gap-2 bg-[var(--junto-yellow)] text-[var(--junto-navy)] font-semibold px-8 py-4 rounded-xl text-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <RotateCcw className="w-5 h-5" />
            Nochmal üben
          </motion.button>

          <p className="text-sm text-[var(--foreground-light)] mt-4">
            Tipp: Fokussiere dich auf deine schwächste Dimension.
          </p>

          <button
            onClick={handleBackToBriefing}
            className="inline-flex items-center gap-2 text-sm text-[var(--foreground-light)] mt-6 hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zum Briefing
          </button>
        </div>
      </section>
    </div>
  );
}
