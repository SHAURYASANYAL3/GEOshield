import { ShieldAlert, Rocket, Database, Cpu, Target, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-[#e2e8f0] font-sans selection:bg-[#00E5FF] selection:text-[#050816]">
      {/* Top Navbar */}
      <header className="border-b border-[#1e293b] bg-[#0f172a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <ShieldAlert className="text-[#00E5FF] w-6 h-6" />
            <span className="font-mono font-bold tracking-widest uppercase text-lg text-white">GEOShield <span className="text-[#64748b] text-sm">OPS-CONSOLE</span></span>
          </Link>
          <div className="flex items-center gap-6 font-mono text-sm">
            <Link href="/" className="text-[#94a3b8] hover:text-white transition-colors">&lt; BACK TO DASHBOARD</Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight flex items-center justify-center gap-4">
            <Rocket className="w-10 h-10 text-[#00E5FF]" />
            About GEOShield
          </h1>
          <p className="text-xl text-[#94a3b8] font-mono max-w-2xl mx-auto leading-relaxed">
            India's Next-Generation Space Weather Operational Console, designed to protect orbital assets from high-energy relativistic electron storms.
          </p>
        </div>

        {/* Mission Panel */}
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#00FF88]"></div>
          <h2 className="text-[#00FF88] font-mono text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <Target className="w-4 h-4" /> The Mission
          </h2>
          <p className="text-[#cbd5e1] leading-relaxed mb-6">
            Geosynchronous satellites are vulnerable to internal charging caused by &gt;2 MeV electron flux spikes. Traditional warning systems rely on simple persistence models or offer highly uncertain forecasts. GEOShield bridges this gap with a physics-informed Machine Learning pipeline capable of predicting P99 crossing events with an unprecedented <strong>12.0 hour advance warning</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#050816] p-4 rounded-lg border border-[#1e293b]">
              <div className="text-[#64748b] font-mono text-xs mb-1">RECALL</div>
              <div className="text-2xl text-white font-mono">97%</div>
              <div className="text-[#64748b] text-[10px] font-mono mt-1">Across 176 Storms</div>
            </div>
            <div className="bg-[#050816] p-4 rounded-lg border border-[#1e293b]">
              <div className="text-[#64748b] font-mono text-xs mb-1">ADVANCE WARNING</div>
              <div className="text-2xl text-white font-mono">12.0h</div>
              <div className="text-[#64748b] text-[10px] font-mono mt-1">Median Lead Time</div>
            </div>
            <div className="bg-[#050816] p-4 rounded-lg border border-[#1e293b]">
              <div className="text-[#64748b] font-mono text-xs mb-1">BLIND TEST (GRASP)</div>
              <div className="text-2xl text-white font-mono">0.933</div>
              <div className="text-[#64748b] text-[10px] font-mono mt-1">Indian-Longitude Recall</div>
            </div>
          </div>
        </div>

        {/* The Science */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-8">
            <h2 className="text-[#00E5FF] font-mono text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Database className="w-4 h-4" /> Data Pipeline
            </h2>
            <ul className="space-y-4 text-[#cbd5e1] text-sm">
              <li className="flex gap-3">
                <span className="text-[#00E5FF] mt-1">▹</span>
                <span><strong>Telemetry:</strong> Trained on over 458,731 rows of historical GOES-13, 14, and 15 electron flux data.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00E5FF] mt-1">▹</span>
                <span><strong>Solar Wind:</strong> Integrated with OMNI upstream propagation metrics including Speed, Density, and IMF Bz.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00E5FF] mt-1">▹</span>
                <span><strong>Explainability:</strong> Integrated SHAP analysis proves the model learned real physics, not dataset artifacts.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-8">
            <h2 className="text-[#FFB300] font-mono text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" /> Model Architecture
            </h2>
            <ul className="space-y-4 text-[#cbd5e1] text-sm">
              <li className="flex gap-3">
                <span className="text-[#FFB300] mt-1">▹</span>
                <span><strong>Algorithm:</strong> Gradient Boosted Trees (XGBoost) optimized for extreme imbalance.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#FFB300] mt-1">▹</span>
                <span><strong>Quantile Regression:</strong> Predicts P50, P90, and P95 bands to accurately capture extreme peak storm events.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#FFB300] mt-1">▹</span>
                <span><strong>Calibration:</strong> Regime-conditional conformal calibration achieving exact 80% coverage across storm and quiet modes.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}