import { TimelineScreen } from '@/components/screens/TimelineScreen';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Timeline | GENESIS 2026',
  description: 'Explore the stages and schedule for GENESIS 2026 Hackathon.',
};

export default function TimelinePage() {
  return <TimelineScreen />;
}
