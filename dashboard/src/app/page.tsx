'use client';
import { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart, Line } from 'recharts';

export default function OperationalDashboard() {
  const [showGrasp, setShowGrasp] = useState(false);
  
  const [dataState, setDataState] = useState<{ status: string, state: any }>({
    status: 'loading',
    state: null
  });

  useEffect(() => {
    const loadData = async () => {
      const stateData = await (await fetch('/data/state.json')).json();
      const forecastData = await (await fetch('/data/forecast.json')).json();
      
      stateData.forecast_timeline = forecastData.map((d: any) => ({
        time: d.time.split(' ')[1].substring(0, 5),
        actual: d.actual,
        median: d.predicted,
        p90: d.upper,
        grasp: d.actual * 0.933
      }));
      
      setDataState({ status: 'success', state: stateData });
    };
    loadData();
  }, []);

  const defaultState = {
    "status_horizon": "N/A",
    "p99_time": "--:-- UTC",
    "p99_hours_from_now": "--",
    "prob_p99": 0,
    "flux_current": 0,
    "flux_status": "-",
    "speed": 0,
    "imf_bz": 0,
    "kp_index": 0,
    "density": 0,
    "alerts": [],
    "shap_primary": "-",
    "shap_secondary": "-",
    "forecast_timeline": []
  };

  const appState = dataState.state || defaultState;

  return (
    <main className="w-full">
      {/* HERO SECTION */}
      <section className="relative w-full h-[600px] flex items-center bg-isro-black px-4 md:px-8 overflow-hidden">
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="metadata"
          poster="/hero/astronaut-space-1.webp"
          className="absolute inset-0 w-full h-full object-cover hidden md:block motion-reduce:hidden pointer-events-none"
        >
          <source src="/hero/hero-video-web.mp4" type="video/mp4" />
        </video>
        
        {/* Fallback image for mobile and motion-reduce */}
        <div 
          className="absolute inset-0 md:hidden motion-reduce:block bg-center bg-cover bg-no-repeat pointer-events-none"
          style={{ backgroundImage: "url('/hero/astronaut-space-1.webp')" }}
        ></div>

        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-[#0a0e1a]/80 md:bg-[#0a0e1a]/55 pointer-events-none"></div>

        <div className="max-w-[1800px] w-full mx-auto relative z-10 flex flex-col items-start gap-4">
          <h1 className="font-[family-name:var(--font-poppins)] font-bold text-6xl md:text-8xl text-white tracking-tight leading-tight">
            <span className="text-isro-orange">GEO</span>Shield
          </h1>
          
          <p className="text-white max-w-2xl text-lg md:text-xl font-light tracking-wide mt-2 drop-shadow-md">
            Operational console tracking solar wind telemetry and radiation hazard forecasts.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <span className="bg-[#111726]/80 backdrop-blur-md border border-[#1F2A44] text-white px-5 py-2.5 rounded-full text-sm font-medium tracking-wide shadow-lg">
              12h Warning
            </span>
            <span className="bg-[#111726]/80 backdrop-blur-md border border-[#1F2A44] text-white px-5 py-2.5 rounded-full text-sm font-medium tracking-wide shadow-lg">
              PE 0.81
            </span>
            <span className="bg-[#111726]/80 backdrop-blur-md border border-[#1F2A44] text-white px-5 py-2.5 rounded-full text-sm font-medium tracking-wide shadow-lg">
              GRASP-validated
            </span>
            <span className="bg-[#111726]/80 backdrop-blur-md border border-[#1F2A44] text-white px-5 py-2.5 rounded-full text-sm font-medium tracking-wide shadow-lg">
              704K samples
            </span>
          </div>
        </div>

        {/* ISRO Signature Gradient Strip at bottom edge */}
        <div className="absolute bottom-0 left-0 w-full h-1 z-20" style={{ background: 'var(--isro-gradient)' }}></div>
      </section>

      {/* DASHBOARD CONTENT */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-16 flex flex-col gap-16">
        
        {/* ROW 1: CRITICAL STATUS & TELEMETRY */}
        <section>
          <h2 className="font-[family-name:var(--font-poppins)] font-semibold text-2xl text-white mb-8 flex items-center gap-3">
            <span className="bg-isro-orange text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">01</span>
            Critical Status
          </h2>
          
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* STATUS BOARD CARD */}
            <div className="col-span-12 xl:col-span-8 bg-card-bg border border-card-border rounded-xl p-6 md:p-8 shadow-lg hover:-translate-y-1 hover:border-isro-orange transition-all duration-300 group">
              <div className="flex justify-between items-start mb-8 pb-4 border-b border-card-border">
                <div className="flex items-center gap-3">
                  <div className="bg-isro-orange text-white px-3 py-1 rounded-md font-bold text-xs uppercase tracking-wider">
                    RED ALERT
                  </div>
                  <span className="text-text-muted text-xs uppercase tracking-widest font-medium">HORIZON: {appState.status_horizon}</span>
                </div>
                <div className="text-xs text-text-muted uppercase">Time to impact: {appState.p99_hours_from_now}h</div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                <div className="flex items-center gap-8">
                  <div className="flex flex-col">
                    <span className="text-5xl font-[family-name:var(--font-poppins)] font-bold text-white mb-2">{appState.prob_p99}%</span>
                    <span className="text-[10px] text-text-muted tracking-widest uppercase">P99 PROBABILITY</span>
                  </div>
                  <div className="w-px h-16 bg-card-border"></div>
                  <div className="flex flex-col">
                    <span className="text-5xl font-[family-name:var(--font-poppins)] font-bold text-isro-orange mb-2">{appState.kp_index}</span>
                    <span className="text-[10px] text-text-muted tracking-widest uppercase">Kp INDEX</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TELEMETRY FEED CARD */}
            <div className="col-span-12 xl:col-span-4 bg-card-bg border border-card-border rounded-xl p-6 md:p-8 shadow-lg hover:-translate-y-1 hover:border-isro-orange transition-all duration-300 group flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-card-border">
                <span className="text-text-muted text-sm font-semibold uppercase tracking-widest">Live Telemetry</span>
                <span className="text-isro-cyan flex items-center gap-2 text-xs uppercase tracking-wider font-bold">
                  <span className="w-2 h-2 bg-isro-cyan rounded-full animate-pulse"></span>
                  LIVE
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                <div>
                  <div className="text-text-muted text-[10px] tracking-widest mb-2 uppercase">SPEED (km/s)</div>
                  <div className="font-[family-name:var(--font-poppins)] text-xl text-white font-semibold">
                    {appState.speed}
                  </div>
                </div>
                <div>
                  <div className="text-text-muted text-[10px] tracking-widest mb-2 uppercase">IMF Bz (nT)</div>
                  <div className="font-[family-name:var(--font-poppins)] text-xl text-white font-semibold">
                    {appState.imf_bz}
                  </div>
                </div>
                <div>
                  <div className="text-text-muted text-[10px] tracking-widest mb-2 uppercase">DENSITY (p/cc)</div>
                  <div className="font-[family-name:var(--font-poppins)] text-xl text-white font-semibold">
                    {appState.density}
                  </div>
                </div>
                <div>
                  <div className="text-isro-orange text-[10px] font-bold tracking-widest mb-2 uppercase">&gt;2MeV FLUX</div>
                  <div className="font-[family-name:var(--font-poppins)] text-xl text-white font-semibold">
                    {appState.flux_current.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROW 2: FORECAST CHART & LOGS */}
        <section>
          <h2 className="font-[family-name:var(--font-poppins)] font-semibold text-2xl text-white mb-8 flex items-center gap-3">
            <span className="bg-isro-orange text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">02</span>
            Forecast Projection
          </h2>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* MAIN CHART */}
            <div className="col-span-12 xl:col-span-9 bg-card-bg border border-card-border rounded-xl p-6 md:p-8 shadow-lg hover:-translate-y-1 hover:border-isro-orange transition-all duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-card-border gap-4">
                <div className="flex gap-4 items-center">
                  <span className="text-text-muted text-sm tracking-widest uppercase">Log Scale Projection</span>
                </div>
                <button 
                  onClick={() => setShowGrasp(!showGrasp)} 
                  className={`px-4 py-2 rounded-lg font-[family-name:var(--font-poppins)] text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${showGrasp ? 'bg-isro-orange text-white shadow-[0_4px_14px_0_rgba(255,101,0,0.39)] hover:-translate-y-0.5' : 'bg-transparent border border-isro-cyan text-isro-cyan hover:bg-isro-cyan hover:text-white'}`}
                >
                  {showGrasp ? 'GRASP: ACTIVE' : 'GRASP: INACTIVE'}
                </button>
              </div>
              
              <div className="w-full h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={appState.forecast_timeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2A44" vertical={true} horizontal={true} />
                    <XAxis dataKey="time" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis scale="log" domain={['auto', 'auto']} stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickFormatter={(val) => val.toLocaleString()} axisLine={false} tickLine={false} dx={-10} />
                    <RechartsTooltip cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} contentStyle={{ backgroundColor: 'var(--bg-deep)', border: '1px solid var(--card-border)', borderRadius: '8px', color: '#fff' }} />
                    
                    <ReferenceLine y={59153} stroke="var(--isro-orange)" strokeWidth={2} strokeDasharray="4 4" label={{ position: 'insideTopLeft', value: 'P99 LIMIT', fill: 'var(--isro-orange)', fontSize: 12, fontWeight: 600 }} />
                    
                    <Area type="monotone" dataKey="p90" stroke="none" fill="var(--isro-orange)" fillOpacity={0.15} />
                    <Line type="monotone" dataKey="actual" stroke="var(--isro-cyan)" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="median" stroke="var(--isro-orange)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                    {showGrasp && <Line type="monotone" dataKey="grasp" stroke="#746FC8" strokeWidth={2} dot={false} />}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* DRIVERS & LOG */}
            <div className="col-span-12 xl:col-span-3 flex flex-col gap-6">
              <div className="bg-card-bg border border-card-border rounded-xl p-6 shadow-lg hover:-translate-y-1 hover:border-isro-orange transition-all duration-300 flex-grow flex flex-col">
                <div className="text-white font-[family-name:var(--font-poppins)] font-semibold text-sm uppercase tracking-wider border-b border-card-border pb-3 mb-5">Explainability</div>
                <div className="flex flex-col gap-4 mb-8">
                  <div>
                    <div className="text-[10px] text-isro-cyan font-bold tracking-widest uppercase mb-1">Primary Driver</div>
                    <div className="text-sm text-white">{appState.shap_primary}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-text-muted tracking-widest uppercase mb-1">Secondary Driver</div>
                    <div className="text-sm text-text-muted">{appState.shap_secondary}</div>
                  </div>
                </div>
                
                <div className="text-white font-[family-name:var(--font-poppins)] font-semibold text-sm uppercase tracking-wider border-b border-card-border pb-3 mb-4 mt-auto">Action Log</div>
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[180px] pr-2 scrollbar-thin">
                  {appState.alerts.map((alert: any, idx: number) => (
                    <div key={idx} className="border-l-2 border-isro-orange pl-4 py-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-isro-cyan font-bold text-[10px] uppercase tracking-wider">
                          {alert.status === 'CORRECT' ? 'PASS' : 'LIMIT'}
                        </span>
                        <span className="text-text-muted text-[10px]">{alert.date}</span>
                      </div>
                      <div className="text-sm text-white font-medium mb-1">{alert.status === 'CORRECT' ? `Lead: ${alert.lead}` : alert.lead}</div>
                      <div className="text-text-muted text-xs">{alert.outcome}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROW 3: VALIDATION PANELS */}
        <section>
          <h2 className="font-[family-name:var(--font-poppins)] font-semibold text-2xl text-white mb-8 flex items-center gap-3">
            <span className="bg-isro-orange text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">03</span>
            Validation Matrix
          </h2>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* ADVANCE WARNING */}
            <div className="bg-card-bg border border-card-border rounded-xl p-6 shadow-lg hover:-translate-y-1 hover:border-isro-orange transition-all duration-300">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-card-border">
                <span className="font-semibold text-sm text-white uppercase tracking-wider">Advance Warning Profile</span>
              </div>
              <div className="flex items-center justify-center bg-bg-deep rounded-lg p-2 border border-card-border">
                <img src="/plots/Screenshot_1.png" alt="Advance Warning" className="w-full h-auto object-contain rounded" />
              </div>
            </div>

            {/* PEAK CAPTURE */}
            <div className="bg-card-bg border border-card-border rounded-xl p-6 shadow-lg hover:-translate-y-1 hover:border-isro-orange transition-all duration-300">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-card-border">
                <span className="font-semibold text-sm text-white uppercase tracking-wider">Peak Capture Efficacy</span>
              </div>
              <div className="flex items-center justify-center bg-bg-deep rounded-lg p-2 border border-card-border">
                <img src="/plots/Screenshot_2.png" alt="Peak Capture" className="w-full h-auto object-contain rounded" />
              </div>
            </div>

            {/* SHAP IMPORTANCE */}
            <div className="bg-card-bg border border-card-border rounded-xl p-6 shadow-lg hover:-translate-y-1 hover:border-isro-orange transition-all duration-300">
              <div className="mb-6 pb-4 border-b border-card-border">
                <span className="font-semibold text-sm text-white uppercase tracking-wider">Global SHAP Importance</span>
              </div>
              <div className="flex justify-center bg-bg-deep rounded-lg p-2 border border-card-border">
                <img src="/plots/Screenshot_3.png" alt="SHAP Importance" className="w-full h-auto object-contain rounded" />
              </div>
            </div>

            {/* SHAP BEESWARM */}
            <div className="bg-card-bg border border-card-border rounded-xl p-6 shadow-lg hover:-translate-y-1 hover:border-isro-orange transition-all duration-300">
              <div className="mb-6 pb-4 border-b border-card-border">
                <span className="font-semibold text-sm text-white uppercase tracking-wider">SHAP Feature Impact</span>
              </div>
              <div className="flex justify-center bg-bg-deep rounded-lg p-2 border border-card-border">
                <img src="/plots/Screenshot_4.png" alt="SHAP Beeswarm" className="w-full h-auto object-contain rounded" />
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
