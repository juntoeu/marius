'use client';

import { motion } from 'framer-motion';
import { DEFAULT_SCENARIO } from '@/lib/scenarios';

interface AudioVisualizerProps {
  isSpeaking: 'agent' | 'user' | null;
}

export default function AudioVisualizer({ isSpeaking }: AudioVisualizerProps) {
  const scenario = DEFAULT_SCENARIO;

  const getRingColor = () => {
    if (isSpeaking === 'agent') return 'var(--junto-yellow)';
    if (isSpeaking === 'user') return 'var(--teal)';
    return 'rgba(255, 255, 255, 0.2)';
  };

  const getStatusText = () => {
    if (isSpeaking === 'agent') return 'Sandra spricht…';
    if (isSpeaking === 'user') return 'Du sprichst…';
    return 'Zuhörend…';
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Visualizer Container */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer Rings */}
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="absolute rounded-full border-2"
            style={{
              width: `${180 + index * 30}px`,
              height: `${180 + index * 30}px`,
              borderColor: getRingColor(),
              opacity: isSpeaking ? 0.3 - index * 0.08 : 0.1,
            }}
            animate={
              isSpeaking
                ? {
                    scale: [1, 1.05 + index * 0.02, 1],
                    opacity: [0.3 - index * 0.08, 0.15 - index * 0.04, 0.3 - index * 0.08],
                  }
                : {
                    scale: [1, 1.01, 1],
                  }
            }
            transition={{
              duration: isSpeaking ? 1 + index * 0.2 : 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.1,
            }}
          />
        ))}

        {/* Glow Effect */}
        {isSpeaking && (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '160px',
              height: '160px',
              background: `radial-gradient(circle, ${getRingColor()}40 0%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Center Circle with Initials */}
        <motion.div
          className={`relative z-10 w-32 h-32 rounded-full bg-[#5B7BA0] flex items-center justify-center ${
            !isSpeaking ? 'animate-breathe' : ''
          }`}
          animate={
            isSpeaking === 'agent'
              ? { scale: [1, 1.05, 1] }
              : isSpeaking === 'user'
              ? { scale: [1, 0.98, 1] }
              : {}
          }
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span className="text-3xl font-semibold text-white">
            {scenario.personaInitials}
          </span>
        </motion.div>
      </div>

      {/* Status Text */}
      <motion.p
        key={getStatusText()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 text-white/70 text-lg"
      >
        {getStatusText()}
      </motion.p>
    </div>
  );
}
