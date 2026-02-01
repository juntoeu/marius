'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function ExpandableSection({
  title,
  children,
  defaultOpen = false,
}: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 py-3 text-left text-[var(--foreground-light)] hover:text-[var(--foreground)] transition-colors"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
        <span className="font-medium">{title}</span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-4 pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
