import { SponsorsScreen } from '@/components/screens/SponsorsScreen';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sponsors | GENESIS 2026',
  description: 'Meet the official sponsors backing GENESIS 2026: GameCloud Technologies and Gamedoora.',
};

export default function SponsorsPage() {
  return <SponsorsScreen />;
}
