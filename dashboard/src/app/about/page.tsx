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
            Geosynchronous satellites are vulnerable to internal charging caused by &gt;2 MeV electron flux spikes. Traditional warning systems rely on simple persistence models or offer highly uncertain forecasts. GEOShield bridges this gap with a physics-informed Machine Learning pipeline capable of predicting P99 crossing events with a <strong className="text-[#F29A2E] font-medium">median 12.0-hour advance warning</strong>.
          </p>

          {/* ── WHY IT MATTERS ─────────────────────────────────────────── */}
          <div className="bg-[#0A0D14] border border-[#343B46] p-6 mb-8">
            <div className="text-[#FF6500] text-xs font-bold tracking-[1.5px] mb-2 uppercase">Why It Matters</div>
            <h2 className="text-[#E8EEFC] font-[family-name:var(--font-orbitron)] font-bold text-[22px] mb-3">The only defense is time</h2>
            <p className="text-[#A7B6DA] text-[15px] leading-[1.65] m-0 font-[family-name:var(--font-inter)]">
              A single deep-dielectric discharge can permanently disable a satellite that took years and
              hundreds of crores to build and launch. ISRO's <strong className="text-[#E8EEFC]">GSAT and INSAT</strong> fleet —
              carrying India's communications, broadcasting, and weather services — orbits directly inside the
              &gt;2 MeV "killer electron" belt. When a storm hits, the only defense is <strong className="text-[#FF6500]">time</strong>:
              a few hours of warning let operators move a spacecraft to safe mode before charge builds to the
              breaking point. GEOShield exists to buy that time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#060606] p-6 rounded-none border border-[#343B46] flex flex-col justify-center items-center hover:border-[#F29A2E] transition-colors cursor-default">
              <div className="text-[#8E959E] font-[family-name:var(--font-inter)] text-xs uppercase tracking-widest mb-2">Recall</div>
              <div className="text-3xl text-white font-[family-name:var(--font-orbitron)] mb-1">95%</div>
              <div className="text-[#F29A2E] text-xs font-[family-name:var(--font-inter)] mt-1 text-center">168 / 176 &middot; default threshold<br/>(98% at looser thresholds)</div>
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
          
          <div className="mt-6 text-[#A7B6DA] text-[11px] leading-[1.6]">
            *Two recall metrics: Event-level recall (95%, across 176 storm onsets) = did we issue any warning within the 12h window before a storm — the operational metric. R99 @ 12h (0.44 ± 0.01) = did the forecast cross P99 at the exact timestep the actual flux did — instantaneous magnitude precision, a stricter test. Both reported for transparency.
          </div>
        </div>

        {/* The Science */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* ── EXPANDED DATA PIPELINE ─────────────────────────────────── */}
          <div className="bg-[#11151E] border border-[#343B46] rounded-none shadow-none p-8 hover:border-isro-cyan transition-colors group">
            <h2 className="text-white font-[family-name:var(--font-orbitron)] text-lg font-medium uppercase tracking-wider mb-2 flex items-center gap-3">
              <span className="bg-[#343B46] text-white px-3 py-1">[DATA]</span> Data Pipeline
            </h2>
            <div className="text-[#00B1FF] text-xs font-bold tracking-[1.5px] mb-6 uppercase">Three real instruments, forensically verified</div>
            <ul className="space-y-4 text-[#A7B6DA] text-[14.5px] font-[family-name:var(--font-inter)] leading-[1.7]">
              <li className="flex gap-3 items-start">
                <span className="text-isro-cyan mt-1">▹</span>
                <span><strong className="text-[#E8EEFC]">GOES-15 EPEAD</strong> (NOAA NCEI): &gt;2 MeV integral electron flux, 2010–2020, science-quality E2E channel with a <code className="bg-[#060606] px-1 py-0.5 rounded text-isro-cyan">DQF==0</code> quality filter, resampled to 5-minute cadence — the forecast target.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-isro-cyan mt-1">▹</span>
                <span><strong className="text-[#E8EEFC]">OMNI HRO</strong> (NASA SPDF): 5-minute solar-wind drivers — flow speed, IMF Bz, proton density, flow pressure, plus AE and SYM-H indices — with instrument fill-values masked.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-isro-cyan mt-1">▹</span>
                <span><strong className="text-[#E8EEFC]">GRASP</strong> (ISRO): storm flux at 48°E, the Indian longitude (Jul 2017 – Sep 2018) — held out <strong className="text-[#00B1FF]">entirely</strong> as an independent blind validation set, never used for training.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-isro-cyan mt-1">▹</span>
                <span><strong className="text-[#E8EEFC]">Merged:</strong> 704,108 total rows (458,731 training rows 2010–2016) × 64 engineered features, inner-joined on 5-minute timestamps. Missing values filled with a <code className="bg-[#060606] px-1 py-0.5 rounded text-isro-cyan">−999</code> sentinel, placed far outside every feature's physical range, so XGBoost's trees isolate them in a single split rather than confusing them with real values. Never filled with <code className="bg-[#060606] px-1 py-0.5 rounded text-isro-cyan">0</code>.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-isro-cyan mt-1">▹</span>
                <span><strong className="text-[#E8EEFC]">Forensic integrity gate:</strong> every file clears 9 integrity + 5 forensic checks before it can train anything. This gate caught and rejected an earlier <em className="text-[#D6D6D6]">synthetic</em> dataset (solar wind capped at 590 km/s, proton temperature below absolute zero, zero gaps over 11 years). Verified real data shows solar wind to <strong className="text-[#E8EEFC]">927 km/s</strong>, SYM-H to <strong className="text-[#E8EEFC]">−233 nT</strong>, and <strong className="text-[#E8EEFC]">91,373</strong> genuine instrument gaps.</span>
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
              <li className="flex gap-4 items-start">
                <span className="text-[#F29A2E] mt-1 border border-[#F29A2E]/30 p-1 bg-[#F29A2E]/10">▹</span>
                <span><strong className="text-white">Expected Calibration Error:</strong> 0.019 — ensuring predicted probabilities exactly match empirical hit rates.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── VALIDATION METRICS ─────────────────────────────────────── */}
        <div className="bg-[#11151E] border border-[#343B46] rounded-none shadow-none p-8 relative hover:border-[#35E0A1] transition-colors group">
          <h2 className="text-white font-[family-name:var(--font-orbitron)] text-lg font-medium uppercase tracking-wider mb-6 flex items-center gap-3">
            <span className="bg-[#343B46] text-white px-3 py-1">[PERFORMANCE]</span> Validation Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-[#060606] p-5 border border-[#343B46] hover:border-[#35E0A1] transition-colors">
              <div className="text-[#35E0A1] text-xs font-bold uppercase tracking-widest mb-1">Skill vs Persistence</div>
              <div className="text-2xl text-white font-[family-name:var(--font-orbitron)]">+0.745</div>
              <div className="text-[#A7B6DA] text-[12px] mt-2 leading-relaxed">We beat the persistence baseline by 74.5 points, proving the model isn't just copying yesterday's reading.</div>
            </div>
            <div className="bg-[#060606] p-5 border border-[#343B46] hover:border-[#35E0A1] transition-colors">
              <div className="text-[#35E0A1] text-xs font-bold uppercase tracking-widest mb-1">ROC AUC (EventWindow)</div>
              <div className="text-2xl text-white font-[family-name:var(--font-orbitron)]">0.988</div>
              <div className="text-[#A7B6DA] text-[12px] mt-2 leading-relaxed">Binary classifiers at 0.95+ are considered very strong; 0.988 is outstanding for storm detection.</div>
            </div>
            <div className="bg-[#060606] p-5 border border-[#343B46] hover:border-[#35E0A1] transition-colors">
              <div className="text-[#35E0A1] text-xs font-bold uppercase tracking-widest mb-1">Expected Calibration Error</div>
              <div className="text-2xl text-white font-[family-name:var(--font-orbitron)]">0.019</div>
              <div className="text-[#A7B6DA] text-[12px] mt-2 leading-relaxed">Excellent calibration—when the model says 30% probability, the hit rate is ~30%. Vital for operators.</div>
            </div>
            <div className="bg-[#060606] p-5 border border-[#343B46] hover:border-[#35E0A1] transition-colors">
              <div className="text-[#35E0A1] text-xs font-bold uppercase tracking-widest mb-1">Band Coverage</div>
              <div className="text-2xl text-white font-[family-name:var(--font-orbitron)]">0.800</div>
              <div className="text-[#A7B6DA] text-[12px] mt-2 leading-relaxed">Conformal calibration successfully shifted empirical coverage from 0.771 precisely to the 0.800 target.</div>
            </div>
            <div className="bg-[#060606] p-5 border border-[#343B46] hover:border-[#35E0A1] transition-colors">
              <div className="text-[#35E0A1] text-xs font-bold uppercase tracking-widest mb-1">P99 Threshold (Train-Only)</div>
              <div className="text-2xl text-white font-[family-name:var(--font-orbitron)]">59,153</div>
              <div className="text-[#A7B6DA] text-[12px] mt-2 leading-relaxed">The critical &gt;2 MeV threshold is derived strictly from the training set, eliminating data leakage.</div>
            </div>
            <div className="bg-[#060606] p-5 border border-[#343B46] hover:border-[#35E0A1] transition-colors">
              <div className="text-[#35E0A1] text-xs font-bold uppercase tracking-widest mb-1">Bootstrap CIs (n=5,033)</div>
              <div className="text-2xl text-white font-[family-name:var(--font-orbitron)]">[0.429–0.457]</div>
              <div className="text-[#A7B6DA] text-[12px] mt-2 leading-relaxed">P99 recall confidence intervals prove the performance isn't just a lucky draw on a small test set.</div>
            </div>
          </div>
        </div>

        {/* ── LIMITATIONS & FUTURE WORK ──────────────────────────────── */}
        <div className="bg-[#11151E] border border-[#343B46] rounded-none shadow-none p-8 relative">
          <div className="text-[#FFB13D] text-xs font-bold tracking-[1.5px] mb-2 uppercase">Limitations &amp; Future Work</div>
          <h2 className="text-[#E8EEFC] font-[family-name:var(--font-orbitron)] font-bold text-[22px] mb-6">Honest about the edges</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <p className="text-[#A7B6DA] text-[14.5px] leading-[1.65] mb-4">
                Every operational space-weather model publishes its limits. Ours come with tested mitigations:
              </p>
              <ul className="space-y-4 text-[#A7B6DA] text-[14.5px] font-[family-name:var(--font-inter)] leading-[1.7]">
                <li className="flex gap-3 items-start">
                  <span className="text-[#FFB13D] mt-1">▹</span>
                  <span><strong className="text-[#E8EEFC]">Extreme-peak magnitude:</strong> the median is conservative on the rarest spikes; the <strong className="text-[#FFB13D]">P90 upper band recovers 93%</strong> of the April 2017 peak — operators plan against the band.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[#FFB13D] mt-1">▹</span>
                  <span><strong className="text-[#E8EEFC]">Ultra-rare (P99.5) events:</strong> recall is tunable (<strong className="text-[#FFB13D]">0.30 → 0.33</strong>) via a high-sensitivity mode, with a disclosed precision tradeoff.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[#FFB13D] mt-1">▹</span>
                  <span><strong className="text-[#E8EEFC]">Local calibration:</strong> absolute levels vary with magnetic local time, so GRASP needs a thin offset — <strong className="text-[#35E0A1]">physics, not a defect</strong>. Storm timing transfers directly (recall 0.933).</span>
                </li>
              </ul>
            </div>
            
            <div>
              <p className="text-[#00B1FF] text-[13.5px] font-bold tracking-[0.5px] mb-4 uppercase">Future Work</p>
              <ul className="space-y-4 text-[#A7B6DA] text-[14.5px] font-[family-name:var(--font-inter)] leading-[1.7]">
                <li className="flex gap-3 items-start">
                  <span className="text-[#00B1FF] mt-1">▹</span>
                  <span>Live operational deployment — the console is already wired for real-time NOAA SWPC and ISRO feeds.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[#00B1FF] mt-1">▹</span>
                  <span>Broaden the GRASP blind test across more longitudes and storm seasons.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[#00B1FF] mt-1">▹</span>
                  <span>Sharper P99.5 sensitivity via targeted extreme-event modeling.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[#00B1FF] mt-1">▹</span>
                  <span>Integrate alerts into ISRO's satellite safe-mode workflow with tunable risk thresholds.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── TEAM ───────────────────────────────────────────────────── */}
        <div className="bg-[#11151E] border border-[#343B46] rounded-none shadow-none p-8 relative">
          <div className="text-[#35E0A1] text-xs font-bold tracking-[1.5px] mb-2 uppercase">Team</div>
          <h2 className="text-[#E8EEFC] font-[family-name:var(--font-orbitron)] font-bold text-[22px] mb-4">Team AstraVajra</h2>
          
          <p className="text-[#A7B6DA] text-[14.5px] leading-[1.65] mb-2">
            Bharatiya Antariksh Hackathon 2026 · Problem Statement 14
          </p>
          <p className="text-[#E8EEFC] text-[15px] mb-2">
            <strong>Paavni Bansal</strong> <span className="text-[#00B1FF]">(Team Lead)</span> · Shaurya Sanyal · Sree Revanth · Saketh Suman Bathini
          </p>
          <p className="text-[#A7B6DA] text-[13.5px] m-0">
            Mentors: Dr. Ankush Bhaskar &amp; Mr. Pritesh Meshram (SPL/VSSC)
          </p>
        </div>

      </div>
    </main>
  );
}