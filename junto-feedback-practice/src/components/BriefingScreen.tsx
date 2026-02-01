'use client';

import { motion } from 'framer-motion';
import { DEFAULT_SCENARIO } from '@/lib/scenarios';
import { useSession } from '@/context/SessionContext';
import ExpandableSection from './ExpandableSection';

export default function BriefingScreen() {
  const { setStatus } = useSession();
  const scenario = DEFAULT_SCENARIO;

  const handleContinue = () => {
    setStatus('mode-select');
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto">
        <span className="text-xl font-bold text-[var(--foreground)]">junto</span>
        <span className="text-sm px-3 py-1 bg-[var(--card-bg)] rounded-full text-[var(--foreground-light)] border border-[var(--card-border)]">
          {scenario.moduleLabel}
        </span>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-12 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Headline */}
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
            Dein Übungsgespräch
          </h1>

          {/* Persona Card */}
          <div className="bg-[var(--card-bg)] rounded-xl p-6 shadow-sm border border-[var(--card-border)] mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-[#5B7BA0] flex items-center justify-center text-white font-semibold text-lg">
                {scenario.personaInitials}
              </div>
              <div>
                <h2 className="font-semibold text-[var(--foreground)]">
                  {scenario.personaName}
                </h2>
                <p className="text-sm text-[var(--foreground-light)]">
                  {scenario.personaRole}
                </p>
              </div>
            </div>
            <p className="text-[var(--foreground)] leading-relaxed">
              {scenario.situationBriefing}
            </p>
          </div>

          {/* Goal Box */}
          <div className="bg-[var(--junto-off-yellow)] rounded-xl p-6 mb-6 border border-[var(--junto-yellow)]/20">
            <p className="text-[var(--foreground)]">
              <span className="font-semibold">Dein Ziel:</span> Führe ein
              Feedbackgespräch mit Sandra. Nutze die Gewaltfreie Kommunikation:
              Beobachtung, Gefühl, Bedürfnis, Bitte. Sandra weiß noch nicht,
              worum es geht.
            </p>
          </div>

          {/* GFK Reminder */}
          <ExpandableSection title="GFK auffrischen">
            <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)]">
              <h3 className="font-semibold text-[var(--foreground)] mb-4">
                Die 4 Schritte der Gewaltfreien Kommunikation:
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="font-medium text-[var(--foreground)]">
                    A. Beobachtung
                  </p>
                  <p className="text-sm text-[var(--foreground-light)]">
                    Was habe ich konkret wahrgenommen? Ohne Bewertung.
                  </p>
                  <p className="text-sm italic text-[var(--foreground-light)] mt-1">
                    „Ich habe seit 3 Wochen kein Update zum Projektstatus
                    erhalten."
                  </p>
                </div>

                <div>
                  <p className="font-medium text-[var(--foreground)]">
                    B. Gefühl
                  </p>
                  <p className="text-sm text-[var(--foreground-light)]">
                    Wie fühle ich mich dabei? Authentisch, kein Vorwurf.
                  </p>
                  <p className="text-sm italic text-[var(--foreground-light)] mt-1">
                    „Das verunsichert mich."
                  </p>
                </div>

                <div>
                  <p className="font-medium text-[var(--foreground)]">
                    C. Bedürfnis
                  </p>
                  <p className="text-sm text-[var(--foreground-light)]">
                    Welches Bedürfnis steckt dahinter? Universell.
                  </p>
                  <p className="text-sm italic text-[var(--foreground-light)] mt-1">
                    „Weil mir Verlässlichkeit und Transparenz wichtig sind."
                  </p>
                </div>

                <div>
                  <p className="font-medium text-[var(--foreground)]">
                    D. Bitte
                  </p>
                  <p className="text-sm text-[var(--foreground-light)]">
                    Was wünsche ich mir? Konkret, positiv, mit Raum für Nein.
                  </p>
                  <p className="text-sm italic text-[var(--foreground-light)] mt-1">
                    „Könnten wir uns dazu bitte austauschen?"
                  </p>
                </div>
              </div>
            </div>
          </ExpandableSection>

          {/* CTA Button */}
          <div className="mt-8 text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
              className="bg-[var(--junto-yellow)] text-[var(--junto-dark)] font-semibold px-12 py-4 rounded-xl text-lg shadow-md hover:shadow-lg transition-shadow"
            >
              Weiter
            </motion.button>
            <p className="text-sm text-[var(--foreground-light)] mt-4">
              Das Gespräch dauert ca. 5 Minuten.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
