import { AboutScreen } from '@/components/screens/AboutScreen';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | GENESIS 2026',
  description: 'Learn about GENESIS 2026 (Fifth Edition) organised by the GDXR Club of AIT Pune.',
};

export default function AboutPage() {
  return <AboutScreen />;
}
