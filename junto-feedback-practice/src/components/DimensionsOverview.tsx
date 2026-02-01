'use client';

import { motion } from 'framer-motion';
import { DEFAULT_SCENARIO } from '@/lib/scenarios';
import { FeedbackData } from '@/lib/types';
import RadarChart from './RadarChart';

interface DimensionsOverviewProps {
  feedback: FeedbackData;
}

function getScoreColor(score: number): string {
  if (score <= 2.0) return 'var(--score-low)';
  if (score <= 3.0) return 'var(--score-medium)';
  if (score <= 4.0) return 'var(--score-good)';
  return 'var(--score-excellent)';
}

export default function DimensionsOverview({ feedback }: DimensionsOverviewProps) {
  const scenario = DEFAULT_SCENARIO;

  // Prepare data for radar chart
  const radarData = scenario.dimensions.map((dim) => ({
    dimension: dim.label,
    score: feedback.dimensionen[dim.id as keyof typeof feedback.dimensionen]?.score || 0,
    fullMark: 5,
  }));

  // Sort dimensions by score for score bars (highest first)
  const sortedDimensions = [...scenario.dimensions].sort((a, b) => {
    const scoreA = feedback.dimensionen[a.id as keyof typeof feedback.dimensionen]?.score || 0;
    const scoreB = feedback.dimensionen[b.id as keyof typeof feedback.dimensionen]?.score || 0;
    return scoreB - scoreA;
  });

  return (
    <section className="py-10 px-6 bg-[var(--card-bg)]">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <div>
            <RadarChart data={radarData} />
          </div>

          {/* Score Bars */}
          <div className="space-y-4">
            {sortedDimensions.map((dimension, index) => {
              const dimData =
                feedback.dimensionen[dimension.id as keyof typeof feedback.dimensionen];
              const score = dimData?.score || 0;
              const color = getScoreColor(score);

              return (
                <motion.div
                  key={dimension.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  className="flex items-center gap-4"
                >
                  <span className="text-sm text-[var(--foreground)] w-36 flex-shrink-0">
                    {dimension.label}
                  </span>
                  <div className="flex-1 h-3 bg-[var(--card-border)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(score / 5) * 100}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  <span
                    className="text-sm font-semibold w-8 text-right"
                    style={{ color }}
                  >
                    {score.toFixed(1)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
