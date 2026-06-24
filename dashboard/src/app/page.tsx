import Hero from '@/components/Hero';
import Mission from '@/components/Mission';
import Architecture from '@/components/Architecture';
import ResultsGrid from '@/components/ResultsGrid';
import CTA from '@/components/CTA';
import SystemStatus from '@/components/SystemStatus';
import ForecastChart from '@/components/ForecastChart';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Hero />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold font-mono text-center mb-8 uppercase tracking-widest text-[#00E5FF]">Operational Dashboard</h2>
        <div className="bg-[#0D1224] p-8 rounded-2xl shadow-2xl border border-gray-800">
          <ForecastChart />
        </div>
      </div>
      <ResultsGrid />
      <Architecture />
      <SystemStatus />
    </main>
  );
}
