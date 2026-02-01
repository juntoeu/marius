'use client';

import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface KeyTakeawayProps {
  takeaway: string;
}

export default function KeyTakeaway({ takeaway }: KeyTakeawayProps) {
  return (
    <section className="py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="bg-[var(--junto-navy)] rounded-xl p-6 border-t-4 border-[var(--junto-yellow)]"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--junto-yellow)] flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-[var(--junto-navy)]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--junto-yellow)] uppercase tracking-wide mb-2">
                Dein wichtigster Lernimpuls
              </h4>
              <p className="text-white leading-relaxed">{takeaway}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
