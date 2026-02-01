'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DEFAULT_SCENARIO } from '@/lib/scenarios';

interface ScoreHeroProps {
  score: number;
  headline: string;
  date: string;
  duration: string;
}

function getScoreColor(score: number): string {
  if (score <= 2.0) return 'var(--score-low)';
  if (score <= 3.0) return 'var(--score-medium)';
  if (score <= 4.0) return 'var(--score-good)';
  return 'var(--score-excellent)';
}

export default function ScoreHero({ score, headline, date, duration }: ScoreHeroProps) {
  const scenario = DEFAULT_SCENARIO;
  const [displayScore, setDisplayScore] = useState(0);
  const scoreColor = getScoreColor(score);
  const percentage = (score / 5) * 100;

  // Animate score count-up
  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const increment = score / steps;
    const stepDuration = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current * 10) / 10);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [score]);

  // Circle dimensions
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <section className="py-12 px-6 bg-gradient-to-b from-[var(--background)] to-[#F0F4F8]">
      <div className="max-w-2xl mx-auto text-center">
        {/* Score Ring */}
        <div className="relative inline-block mb-8">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--card-border)"
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          {/* Score in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-5xl font-bold"
              style={{ color: scoreColor }}
            >
              {displayScore.toFixed(1)}
            </motion.span>
            <span className="text-lg text-[var(--foreground-light)]">/ 5</span>
          </div>
        </div>

        {/* Headline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-lg text-[var(--foreground-light)] mb-4 max-w-md mx-auto"
        >
          {headline}
        </motion.p>

        {/* Meta info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-sm text-[var(--foreground-light)]/70"
        >
          Gespräch mit {scenario.personaName} · {date} · {duration}
        </motion.p>
      </div>
    </section>
  );
}
