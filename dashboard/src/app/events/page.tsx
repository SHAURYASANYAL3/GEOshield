import EventHero from '@/components/EventHero';
import ScenarioMode from '@/components/ScenarioMode';
import ProbabilityTimeline from '@/components/ProbabilityTimeline';
import ThresholdSlider from '@/components/ThresholdSlider';
import StormReplay from '@/components/StormReplay';
import LeadTable from '@/components/LeadTable';

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <EventHero />
        <ScenarioMode />
        <ProbabilityTimeline />
        <ThresholdSlider />
        <StormReplay />
        <LeadTable />
      </div>
    </main>
  );
}
