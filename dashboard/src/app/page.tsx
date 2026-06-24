import Hero from '@/components/Hero';
import Mission from '@/components/Mission';
import Architecture from '@/components/Architecture';
import ResultsGrid from '@/components/ResultsGrid';
import CTA from '@/components/CTA';
import SystemStatus from '@/components/SystemStatus';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Mission />
      <Architecture />
      <ResultsGrid />
      <SystemStatus />
      <CTA />
    </main>
  );
}
