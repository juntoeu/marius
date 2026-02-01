'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Square } from 'lucide-react';
import { useConversation } from '@elevenlabs/react';
import { useSession } from '@/context/SessionContext';
import { DEFAULT_SCENARIO } from '@/lib/scenarios';
import Timer from './Timer';
import AudioVisualizer from './AudioVisualizer';

export default function VoiceConversation() {
  const { state, addTranscriptEntry, setStatus, setConversationStartTime, setError } =
    useSession();
  const scenario = DEFAULT_SCENARIO;
  const [isSpeaking, setIsSpeaking] = useState<'agent' | 'user' | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      if (!hasStarted) {
        setHasStarted(true);
        setConversationStartTime(Date.now());
      }
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
    },
    onMessage: (message) => {
      console.log('Message:', message);
      if (message.source === 'ai') {
        addTranscriptEntry({
          role: 'agent',
          text: message.message,
          timestamp: Date.now(),
        });
      } else if (message.source === 'user') {
        addTranscriptEntry({
          role: 'user',
          text: message.message,
          timestamp: Date.now(),
        });
      }
    },
    onError: (error) => {
      console.error('ElevenLabs Error:', error);
      setError('Die Verbindung wurde unterbrochen. Möchtest du das Gespräch neu starten?');
    },
  });

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
      if (!agentId) {
        setError('ElevenLabs Agent ID nicht konfiguriert.');
        return;
      }
      await conversation.startSession({
        agentId,
        connectionType: 'webrtc',
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setError('Mikrofon-Zugriff verweigert. Bitte erlaube den Zugriff.');
    }
  }, [conversation, setError]);

  useEffect(() => {
    startConversation();

    return () => {
      conversation.endSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (conversation.isSpeaking) {
      setIsSpeaking('agent');
    } else if (conversation.status === 'connected') {
      // Check if user might be speaking based on volume levels
      setIsSpeaking(null);
    }
  }, [conversation.isSpeaking, conversation.status]);

  const handleEndConversation = async () => {
    await conversation.endSession();

    // Check if conversation is long enough
    const minTurns = 3;
    if (state.transcript.length < minTurns) {
      setError(
        'Das Gespräch war sehr kurz. Für hilfreiches Feedback brauchen wir mindestens 2-3 Minuten Gesprächsinhalt. Möchtest du es nochmal versuchen?'
      );
      return;
    }

    setStatus('analyzing');
  };

  const elapsedMinutes = state.conversationStartTime
    ? (Date.now() - state.conversationStartTime) / 60000
    : 0;
  const showProminentEnd = elapsedMinutes >= 2;

  return (
    <div className="min-h-screen bg-[var(--junto-navy)] flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-xl font-bold text-white">junto</span>
        <div className="text-center">
          <p className="text-white font-medium">{scenario.personaName}</p>
          <p className="text-white/60 text-sm">{scenario.personaRole}</p>
        </div>
        <Timer
          startTime={state.conversationStartTime}
          softLimitMinutes={scenario.softTimerMinutes}
        />
      </header>

      {/* Main Content - Audio Visualizer */}
      <main className="flex-1 flex items-center justify-center px-6">
        <AudioVisualizer isSpeaking={isSpeaking} />
      </main>

      {/* Bottom Bar */}
      <footer className="px-6 py-8 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleEndConversation}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            showProminentEnd
              ? 'bg-[var(--coral)] text-white'
              : 'border border-white/30 text-white/70 hover:text-white hover:border-white/50'
          }`}
        >
          <Square className="w-4 h-4" />
          Gespräch beenden
        </motion.button>
      </footer>

      {/* Error Modal */}
      {state.error && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--card-bg)] rounded-xl p-6 max-w-md w-full"
          >
            <p className="text-[var(--foreground)] mb-6">{state.error}</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setError(null);
                  startConversation();
                }}
                className="flex-1 bg-[var(--junto-yellow)] text-[var(--junto-navy)] font-medium py-3 rounded-lg"
              >
                Neu starten
              </button>
              <button
                onClick={() => setStatus('mode-select')}
                className="flex-1 border border-[var(--card-border)] text-[var(--foreground)] font-medium py-3 rounded-lg"
              >
                Modus wechseln
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
