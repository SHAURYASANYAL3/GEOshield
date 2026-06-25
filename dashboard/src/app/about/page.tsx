// Removed lucide-react
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-[#E6EDF7] font-sans selection:bg-[#00E5FF] selection:text-[#050816]">
      {/* Top Navbar */}
      <header className="border-b border-white/10 bg-[#0D1224]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span className="text-[#00E5FF] font-mono text-xl font-bold">[GEO]</span>
            <span className="font-mono font-bold tracking-widest uppercase text-lg text-white">GEOShield <span className="text-[#8892A6] text-sm">OPS-CONSOLE</span></span>
          </Link>
          <div className="flex items-center gap-6 font-mono text-sm">
            <Link href="/" className="text-[#8892A6] hover:text-white transition-colors">&lt; BACK TO DASHBOARD</Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight flex items-center justify-center gap-4">
            <span className="text-[#00E5FF] font-mono">[MISSION]</span>
            About GEOShield
          </h1>
          <p className="text-xl text-[#8892A6] font-mono max-w-2xl mx-auto leading-relaxed">
            India's Next-Generation Space Weather Operational Console, designed to protect orbital assets from high-energy relativistic electron storms.
          </p>
        </div>

        {/* Mission Panel */}
        <div className="bg-[#0D1224] border border-white/10 rounded-2xl shadow-sm p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#00FF88]"></div>
          <h2 className="text-[#00FF88] font-mono text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="font-mono text-[#00FF88]">[TARGET]</span> The Mission
          </h2>
          <p className="text-[#E6EDF7] leading-relaxed mb-6">
            Geosynchronous satellites are vulnerable to internal charging caused by &gt;2 MeV electron flux spikes. Traditional warning systems rely on simple persistence models or offer highly uncertain forecasts. GEOShield bridges this gap with a physics-informed Machine Learning pipeline capable of predicting P99 crossing events with a <strong>12.0 hour advance warning</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#050816] p-4 rounded-xl border border-white/10">
              <div className="text-[#8892A6] font-mono text-xs mb-1">RECALL</div>
              <div className="text-2xl text-white font-mono">97%</div>
              <div className="text-[#8892A6] text-[10px] font-mono mt-1">Across 176 Storms</div>
            </div>
            <div className="bg-[#050816] p-4 rounded-xl border border-white/10">
              <div className="text-[#8892A6] font-mono text-xs mb-1">ADVANCE WARNING</div>
              <div className="text-2xl text-white font-mono">12.0h</div>
              <div className="text-[#8892A6] text-[10px] font-mono mt-1">Median Lead Time</div>
            </div>
            <div className="bg-[#050816] p-4 rounded-xl border border-white/10">
              <div className="text-[#8892A6] font-mono text-xs mb-1">BLIND TEST (GRASP)</div>
              <div className="text-2xl text-white font-mono">0.933</div>
              <div className="text-[#8892A6] text-[10px] font-mono mt-1">Indian-Longitude Recall</div>
            </div>
          </div>
        </div>

        {/* The Science */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0D1224] border border-white/10 rounded-2xl shadow-sm p-8">
            <h2 className="text-[#00E5FF] font-mono text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="font-mono text-[#00E5FF]">[DATA]</span> Data Pipeline
            </h2>
            <ul className="space-y-4 text-[#E6EDF7] text-sm">
              <li className="flex gap-3">
                <span className="text-[#00E5FF] mt-1">▹</span>
                <span><strong>Telemetry:</strong> Trained on 458,731 rows of GOES-15 electron flux data (2010–2016).</span>
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

          <div className="bg-[#0D1224] border border-white/10 rounded-2xl shadow-sm p-8">
            <h2 className="text-[#FFB300] font-mono text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="font-mono text-[#FFB300]">[MODEL]</span> Model Architecture
            </h2>
            <ul className="space-y-4 text-[#E6EDF7] text-sm">
              <li className="flex gap-3">
                <span className="text-[#FFB300] mt-1">▹</span>
                <span><strong>Algorithm:</strong> Gradient Boosted Trees (XGBoost) optimized for extreme imbalance.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#FFB300] mt-1">▹</span>
                <span><strong>Quantile Regression:</strong> Predicts P10, P50, P90 bands to accurately capture extreme peak storm events.</span>
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