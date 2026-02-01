'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronDown, CheckCircle, ArrowUpCircle, Lightbulb, Quote } from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import { DEFAULT_SCENARIO } from '@/lib/scenarios';
import RadarChart from './RadarChart';

function getScoreColor(score: number): string {
  if (score <= 2.0) return 'var(--score-low)';
  if (score <= 3.0) return 'var(--score-medium)';
  if (score <= 4.0) return 'var(--score-good)';
  return 'var(--score-excellent)';
}

export default function FeedbackScreen() {
  const { state, resetForRetry } = useSession();
  const feedback = state.feedback;
  const scenario = DEFAULT_SCENARIO;
  const [showDetails, setShowDetails] = useState(false);

  if (!feedback) {
    return null;
  }

  // Prepare radar data
  const radarData = scenario.dimensions.map((dim) => ({
    dimension: dim.label,
    score: feedback.dimensionen[dim.id as keyof typeof feedback.dimensionen]?.score || 0,
    fullMark: 5,
  }));

  // Sort dimensions by score
  const sortedDimensions = [...scenario.dimensions].sort((a, b) => {
    const scoreA = feedback.dimensionen[a.id as keyof typeof feedback.dimensionen]?.score || 0;
    const scoreB = feedback.dimensionen[b.id as keyof typeof feedback.dimensionen]?.score || 0;
    return scoreB - scoreA;
  });

  const scoreColor = getScoreColor(feedback.gesamtscore);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
        <span className="text-xl font-bold text-[var(--foreground)]">junto</span>
        <span className="text-sm text-[var(--foreground-light)]">Deine Auswertung</span>
      </header>

      <main className="px-6 pb-6 max-w-6xl mx-auto">
        {/* Top Section: Score + Radar + Dimensions */}
        <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm mb-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Score Circle */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="var(--card-border)"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke={scoreColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 56}
                    initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - feedback.gesamtscore / 5) }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold" style={{ color: scoreColor }}>
                    {feedback.gesamtscore.toFixed(1)}
                  </span>
                  <span className="text-sm text-[var(--foreground-light)]">/ 5</span>
                </div>
              </div>
              <p className="text-sm text-[var(--foreground-light)] text-center mt-3 max-w-[200px]">
                {feedback.headline}
              </p>
            </div>

            {/* Radar Chart */}
            <div className="h-48 lg:h-auto">
              <RadarChart data={radarData} />
            </div>

            {/* Score Bars */}
            <div className="space-y-2">
              {sortedDimensions.map((dimension) => {
                const dimData = feedback.dimensionen[dimension.id as keyof typeof feedback.dimensionen];
                const score = dimData?.score || 0;
                const color = getScoreColor(score);

                return (
                  <div key={dimension.id} className="flex items-center gap-2">
                    <span className="text-xs text-[var(--foreground)] w-28 truncate">
                      {dimension.label}
                    </span>
                    <div className="flex-1 h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(score / 5) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-xs font-semibold w-6 text-right" style={{ color }}>
                      {score.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Two Column: Likes + Improvements */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* Das hast du gut gemacht */}
          <div className="bg-[var(--card-bg)] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-[var(--junto-green)]" />
              <h3 className="font-semibold text-[var(--foreground)] text-sm">Das hast du gut gemacht</h3>
            </div>
            <div className="space-y-3">
              {feedback.likes.slice(0, 2).map((like, index) => (
                <div key={index} className="text-sm">
                  <p className="text-[var(--foreground)] mb-1">{like.text}</p>
                  <div className="bg-[var(--junto-off-green)] rounded-lg px-3 py-2 text-xs italic text-[var(--foreground-light)]">
                    „{like.zitat}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Das kannst du verbessern */}
          <div className="bg-[var(--card-bg)] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpCircle className="w-4 h-4 text-[var(--amber)]" />
              <h3 className="font-semibold text-[var(--foreground)] text-sm">Das kannst du verbessern</h3>
            </div>
            <div className="space-y-3">
              {feedback.verbesserungen.slice(0, 2).map((item, index) => (
                <div key={index} className="text-sm">
                  <p className="text-[var(--foreground)] mb-1">{item.text}</p>
                  <div className="bg-[var(--junto-off-yellow)] rounded-lg px-3 py-2 text-xs italic text-[var(--foreground-light)] mb-1">
                    „{item.zitat}"
                  </div>
                  <div className="bg-[var(--junto-off-green)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)]">
                    <span className="font-medium">Besser:</span> „{item.alternative}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Takeaway + CTA */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* Key Takeaway */}
          <div className="bg-[var(--junto-dark)] rounded-2xl p-5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--junto-yellow)] flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-[var(--junto-dark)]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[var(--junto-yellow)] uppercase tracking-wide mb-1">
                Dein Lernimpuls
              </h4>
              <p className="text-white text-sm leading-relaxed">{feedback.key_takeaway}</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="bg-[var(--card-bg)] rounded-2xl p-5 shadow-sm flex flex-col justify-center items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetForRetry}
              className="w-full flex items-center justify-center gap-2 bg-[var(--junto-yellow)] text-[var(--junto-dark)] font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <RotateCcw className="w-4 h-4" />
              Nochmal üben
            </motion.button>
            <p className="text-xs text-[var(--foreground-light)] text-center">
              Fokussiere dich auf deine schwächste Dimension
            </p>
          </div>
        </div>

        {/* Expandable Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full bg-[var(--card-bg)] rounded-2xl p-4 shadow-sm flex items-center justify-center gap-2 text-[var(--foreground-light)] hover:text-[var(--foreground)] transition-colors"
        >
          <span className="text-sm font-medium">
            {showDetails ? 'Weniger Details' : 'Ausführliches Feedback anzeigen'}
          </span>
          <motion.div animate={{ rotate: showDetails ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* Detailed Dimension Explanations */}
                <div className="bg-[var(--card-bg)] rounded-2xl p-5 shadow-sm">
                  <h3 className="font-semibold text-[var(--foreground)] mb-4">Detailbewertung pro Dimension</h3>
                  <div className="space-y-4">
                    {scenario.dimensions.map((dimension) => {
                      const dimData = feedback.dimensionen[dimension.id as keyof typeof feedback.dimensionen];
                      const score = dimData?.score || 0;
                      const color = getScoreColor(score);

                      return (
                        <div key={dimension.id} className="border-b border-[var(--card-border)] pb-3 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-[var(--foreground)]">{dimension.label}</span>
                            <span className="font-semibold" style={{ color }}>{score.toFixed(1)}/5</span>
                          </div>
                          <p className="text-sm text-[var(--foreground-light)]">{dimData?.begruendung}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* All Likes */}
                {feedback.likes.length > 2 && (
                  <div className="bg-[var(--card-bg)] rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-4 h-4 text-[var(--junto-green)]" />
                      <h3 className="font-semibold text-[var(--foreground)]">Weitere Stärken</h3>
                    </div>
                    <div className="space-y-3">
                      {feedback.likes.slice(2).map((like, index) => (
                        <div key={index} className="border-l-2 border-[var(--junto-green)] pl-3">
                          <p className="text-sm text-[var(--foreground)] mb-1">{like.text}</p>
                          <div className="flex items-start gap-1">
                            <Quote className="w-3 h-3 text-[var(--foreground-light)] mt-0.5 flex-shrink-0" />
                            <p className="text-xs italic text-[var(--foreground-light)]">{like.zitat}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Improvements */}
                {feedback.verbesserungen.length > 2 && (
                  <div className="bg-[var(--card-bg)] rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowUpCircle className="w-4 h-4 text-[var(--amber)]" />
                      <h3 className="font-semibold text-[var(--foreground)]">Weitere Verbesserungsvorschläge</h3>
                    </div>
                    <div className="space-y-3">
                      {feedback.verbesserungen.slice(2).map((item, index) => (
                        <div key={index} className="border-l-2 border-[var(--amber)] pl-3">
                          <p className="text-sm text-[var(--foreground)] mb-1">{item.text}</p>
                          <p className="text-xs text-[var(--foreground-light)] mb-1">
                            <span className="font-medium">Du:</span> „{item.zitat}"
                          </p>
                          <p className="text-xs text-[var(--junto-green)]">
                            <span className="font-medium">Besser:</span> „{item.alternative}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
