'use client';

import { useSession } from '@/context/SessionContext';
import BriefingScreen from '@/components/BriefingScreen';
import ModeSelectScreen from '@/components/ModeSelectScreen';
import VoiceConversation from '@/components/VoiceConversation';
import TextConversation from '@/components/TextConversation';
import AnalyzingScreen from '@/components/AnalyzingScreen';
import FeedbackScreen from '@/components/FeedbackScreen';

export default function Home() {
  const { state } = useSession();

  switch (state.status) {
    case 'briefing':
      return <BriefingScreen />;
    case 'mode-select':
      return <ModeSelectScreen />;
    case 'conversation':
      return state.mode === 'voice' ? <VoiceConversation /> : <TextConversation />;
    case 'analyzing':
      return <AnalyzingScreen />;
    case 'feedback':
      return <FeedbackScreen />;
    default:
      return <BriefingScreen />;
  }
}
