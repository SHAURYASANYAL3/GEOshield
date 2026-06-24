import ValidationHero from '@/components/ValidationHero';
import ResultsTable from '@/components/ResultsTable';
import BenchmarkCards from '@/components/BenchmarkCards';
import FailureGallery from '@/components/FailureGallery';
import IntegrityPanel from '@/components/IntegrityPanel';
import CalibrationPlot from '@/components/CalibrationPlot';
import ClaimCard from '@/components/ClaimCard';

export default function ValidationPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <ValidationHero />
        <ResultsTable />
        <BenchmarkCards />
        <FailureGallery />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <IntegrityPanel />
          <CalibrationPlot />
        </div>
        <ClaimCard />
      </div>
    </main>
  );
}
