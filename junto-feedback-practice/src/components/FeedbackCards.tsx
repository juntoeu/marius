'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowUpCircle, Quote } from 'lucide-react';
import { FeedbackLike, FeedbackImprovement } from '@/lib/types';

interface LikeCardsProps {
  likes: FeedbackLike[];
}

interface ImprovementCardsProps {
  improvements: FeedbackImprovement[];
}

export function LikeCards({ likes }: LikeCardsProps) {
  return (
    <section className="py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle className="w-5 h-5 text-[var(--score-good)]" />
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Das hast du gut gemacht
          </h3>
        </div>

        <div className="space-y-4">
          {likes.map((like, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.15, duration: 0.4 }}
              className="bg-[var(--card-bg)] rounded-xl p-5 border-l-4 border-[var(--score-good)] shadow-sm"
            >
              <p className="text-[var(--foreground)] mb-4">{like.text}</p>
              <div className="bg-[var(--teal-light)] rounded-lg p-4 relative">
                <Quote className="w-4 h-4 text-[var(--teal)] absolute top-3 left-3 opacity-50" />
                <p className="text-sm text-[var(--foreground)] italic pl-6">
                  „{like.zitat}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ImprovementCards({ improvements }: ImprovementCardsProps) {
  return (
    <section className="py-10 px-6 bg-[var(--background)]">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <ArrowUpCircle className="w-5 h-5 text-[var(--amber)]" />
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Das kannst du verbessern
          </h3>
        </div>

        <div className="space-y-4">
          {improvements.map((improvement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.15, duration: 0.4 }}
              className="bg-[var(--card-bg)] rounded-xl p-5 border-l-4 border-[var(--amber)] shadow-sm"
            >
              <p className="text-[var(--foreground)] mb-4">{improvement.text}</p>

              {/* Original Quote */}
              <div className="bg-[var(--amber-light)] rounded-lg p-4 mb-3 relative">
                <Quote className="w-4 h-4 text-[var(--amber)] absolute top-3 left-3 opacity-50" />
                <p className="text-sm text-[var(--foreground)] italic pl-6">
                  „{improvement.zitat}"
                </p>
              </div>

              {/* Better Alternative */}
              <div className="bg-[var(--teal-light)] rounded-lg p-4 relative">
                <span className="text-xs font-medium text-[var(--teal)] uppercase tracking-wide mb-2 block">
                  Zum Beispiel:
                </span>
                <p className="text-sm text-[var(--foreground)]">
                  „{improvement.alternative}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
