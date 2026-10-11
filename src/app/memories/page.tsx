import { MemoriesScreen } from '@/components/screens/MemoriesScreen';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Memories | GENESIS 2026',
  description: 'Relive the excitement and achievements from previous editions of GENESIS.',
};

export default function MemoriesPage() {
  return <MemoriesScreen />;
}
