import { PrizeScreen } from '@/components/screens/PrizeScreen';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prize Pool | GENESIS 2026',
  description: 'Explore the ₹60,000 cash prizes for Main Track and VR Track at GENESIS 2026.',
};

export default function PrizePoolPage() {
  return <PrizeScreen />;
}
