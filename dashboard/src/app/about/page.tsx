import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#060606] text-white overflow-hidden pb-20">
      
      <div className="max-w-[1400px] mx-auto px-6 py-16 flex flex-col gap-12">
        {/* Header */}
        <div className="text-left border-b border-[#343B46] pb-10">
          <h1 className="font-[family-name:var(--font-orbitron)] text-[40px] md:text-[58px] font-light tracking-[0.5px] leading-[1.1] mb-6 flex items-center gap-4">
            <span className="text-[#F29A2E] bg-[#11151E] border border-[#343B46] px-4 py-2 text-2xl">[MISSION]</span>
            About GEOShield
          </h1>
          <p className="text-[#D6D6D6] text-[18px] font-light leading-[2] font-[family-name:var(--font-inter)] max-w-4xl">
            India's Next-Generation Space Weather Operational Console, designed to protect orbital assets from high-energy relativistic electron storms.
          </p>
        </div>

        {/* Mission Panel */}
        <div className="bg-[#11151E] border border-[#343B46] rounded-none shadow-none p-8 relative">
          <div className="absolute top-0 left-0 w-2 h-full bg-isro-cyan"></div>
          <h2 className="text-isro-cyan font-[family-name:var(--font-orbitron)] text-lg font-medium uppercase tracking-wider mb-6 flex items-center gap-3">
            <span className="bg-isro-cyan/10 border border-isro-cyan/20 px-2 py-1">[TARGET]</span> The Mission
          </h2>
          <p className="text-white font-[family-name:var(--font-inter)] leading-[1.8] mb-8 text-lg">
            Geosynchronous satellites are vulnerable to internal charging caused by &gt;2 MeV electron flux spikes. Traditional warning systems rely on simple persistence models or offer highly uncertain forecasts. GEOShield bridges this gap with a physics-informed Machine Learning pipeline capable of predicting P99 crossing events with a <strong className="text-[#F29A2E] font-medium">12.0 hour advance warning</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#060606] p-6 rounded-none border border-[#343B46] flex flex-col justify-center items-center hover:border-[#F29A2E] transition-colors cursor-default">
              <div className="text-[#8E959E] font-[family-name:var(--font-inter)] text-xs uppercase tracking-widest mb-2">Recall</div>
              <div className="text-3xl text-white font-[family-name:var(--font-orbitron)] mb-1">97%</div>
              <div className="text-[#F29A2E] text-xs font-[family-name:var(--font-inter)] mt-1">Across 176 Storms</div>
            </div>
            <div className="bg-[#060606] p-6 rounded-none border border-[#343B46] flex flex-col justify-center items-center hover:border-[#F29A2E] transition-colors cursor-default">
              <div className="text-[#8E959E] font-[family-name:var(--font-inter)] text-xs uppercase tracking-widest mb-2">Advance Warning</div>
              <div className="text-3xl text-white font-[family-name:var(--font-orbitron)] mb-1">12.0h</div>
              <div className="text-[#F29A2E] text-xs font-[family-name:var(--font-inter)] mt-1">Median Lead Time</div>
            </div>
            <div className="bg-[#060606] p-6 rounded-none border border-[#343B46] flex flex-col justify-center items-center hover:border-[#F29A2E] transition-colors cursor-default">
              <div className="text-[#8E959E] font-[family-name:var(--font-inter)] text-xs uppercase tracking-widest mb-2">Blind Test (GRASP)</div>
              <div className="text-3xl text-white font-[family-name:var(--font-orbitron)] mb-1">0.933</div>
              <div className="text-[#F29A2E] text-xs font-[family-name:var(--font-inter)] mt-1">Indian-Longitude Recall</div>
            </div>
          </div>
        </div>

        {/* The Science */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#11151E] border border-[#343B46] rounded-none shadow-none p-8 hover:border-isro-cyan transition-colors group">
            <h2 className="text-white font-[family-name:var(--font-orbitron)] text-lg font-medium uppercase tracking-wider mb-6 flex items-center gap-3">
              <span className="bg-[#343B46] text-white px-3 py-1">[DATA]</span> Data Pipeline
            </h2>
            <ul className="space-y-6 text-[#D6D6D6] text-[15px] font-[family-name:var(--font-inter)] leading-relaxed">
              <li className="flex gap-4 items-start">
                <span className="text-isro-cyan mt-1 border border-isro-cyan/30 p-1 bg-isro-cyan/10">▹</span>
                <span><strong className="text-white">Telemetry:</strong> Trained on 458,731 rows of GOES-15 electron flux data (2010–2016).</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-isro-cyan mt-1 border border-isro-cyan/30 p-1 bg-isro-cyan/10">▹</span>
                <span><strong className="text-white">Solar Wind:</strong> Integrated with OMNI upstream propagation metrics including Speed, Density, and IMF Bz.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-isro-cyan mt-1 border border-isro-cyan/30 p-1 bg-isro-cyan/10">▹</span>
                <span><strong className="text-white">Explainability:</strong> Integrated SHAP analysis proves the model learned real physics, not dataset artifacts.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#11151E] border border-[#343B46] rounded-none shadow-none p-8 hover:border-[#F29A2E] transition-colors group">
            <h2 className="text-white font-[family-name:var(--font-orbitron)] text-lg font-medium uppercase tracking-wider mb-6 flex items-center gap-3">
              <span className="bg-[#343B46] text-white px-3 py-1">[MODEL]</span> Architecture
            </h2>
            <ul className="space-y-6 text-[#D6D6D6] text-[15px] font-[family-name:var(--font-inter)] leading-relaxed">
              <li className="flex gap-4 items-start">
                <span className="text-[#F29A2E] mt-1 border border-[#F29A2E]/30 p-1 bg-[#F29A2E]/10">▹</span>
                <span><strong className="text-white">Algorithm:</strong> Gradient Boosted Trees (XGBoost) optimized for extreme imbalance.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-[#F29A2E] mt-1 border border-[#F29A2E]/30 p-1 bg-[#F29A2E]/10">▹</span>
                <span><strong className="text-white">Quantile Regression:</strong> Predicts P10, P50, P90 bands to accurately capture extreme peak storm events.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-[#F29A2E] mt-1 border border-[#F29A2E]/30 p-1 bg-[#F29A2E]/10">▹</span>
                <span><strong className="text-white">Calibration:</strong> Regime-conditional conformal calibration achieving exact 80% coverage.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}