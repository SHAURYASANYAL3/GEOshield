import Hero from '@/components/Hero';
import Mission from '@/components/Mission';
import Architecture from '@/components/Architecture';
import ResultsGrid from '@/components/ResultsGrid';
import CTA from '@/components/CTA';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Mission />
      <Architecture />
      <ResultsGrid />
      <CTA />
    </main>
  );
}
