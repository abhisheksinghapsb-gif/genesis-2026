import { FaqScreen } from '@/components/screens/FaqScreen';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQs | GENESIS 2026',
  description: 'Frequently asked questions about GENESIS 2026 hackathon participation, rules, and prizes.',
};

export default function FaqsPage() {
  return <FaqScreen />;
}
