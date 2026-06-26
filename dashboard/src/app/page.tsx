'use client';
import { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart, Line } from 'recharts';
import { motion, Variants } from 'framer-motion';

import April2017Chart from '@/components/April2017Chart';
import April2017P90Chart from '@/components/April2017P90Chart';
import MultiHorizonChart from '@/components/MultiHorizonChart';
import ShapBeeswarmChart from '@/components/ShapBeeswarmChart';
import ShapImportanceChart from '@/components/ShapImportanceChart';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

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
      {/* HERO VIDEO SECTION (Empty of text) */}
      <section className="relative w-full bg-[#060606] overflow-hidden flex items-center min-h-[400px] md:min-h-[600px] max-h-[800px]">
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="metadata"
          poster="/hero/astronaut-space-1.webp"
          className="absolute inset-0 w-full h-full object-contain opacity-80 hidden md:block motion-reduce:hidden pointer-events-none"
        >
          <source src="/hero/hero-video-web.mp4" type="video/mp4" />
        </video>
        
        {/* Fallback image for mobile and motion-reduce */}
        <div 
          className="absolute inset-0 md:hidden motion-reduce:block bg-center bg-cover bg-no-repeat opacity-60 pointer-events-none"
          style={{ backgroundImage: "url('/hero/astronaut-space-1.webp')" }}
        ></div>

        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-[#060606]/20 pointer-events-none"></div>
      </section>

      {/* DASHBOARD CONTENT & HERO INFO */}
      <motion.div 
        className="max-w-[1800px] mx-auto px-4 md:px-8 py-16 flex flex-col gap-16"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        
        {/* HERO INFO BLOCK (Moved below video) */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-[70px] border-b border-[#343B46] pb-16">
          
          {/* TEXT & STATS */}
          <motion.div variants={fadeUp} className="w-full lg:w-[620px] flex-shrink-0">
            {/* HEADING */}
            <h1 className="font-[family-name:var(--font-orbitron)] text-[48px] md:text-[58px] font-light tracking-[0.5px] leading-[1.1] mb-8">
              <div className="text-white">GEOShield Operational</div>
              <div className="text-[#F29A2E]">Console 2026</div>
            </h1>

            <p className="text-white text-[18px] font-light leading-[2] mb-[40px] font-[family-name:var(--font-inter)]">
              Operational console tracking solar wind telemetry and radiation hazard forecasts. System nominal, tracking 1.2M_KM horizon.
            </p>

            <div className="flex flex-wrap h-auto md:h-[62px] gap-3">
              <motion.div whileHover={{ scale: 1.05, borderColor: "#F29A2E" }} className="bg-[#11151E] border border-[#343B46] px-5 py-3 md:py-0 flex flex-col justify-center items-center flex-1 transition-colors cursor-default">
                <span className="text-[#F29A2E] font-[family-name:var(--font-orbitron)] text-lg mb-1">12h</span>
                <span className="text-white text-xs whitespace-nowrap">Warning</span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, borderColor: "#F29A2E" }} className="bg-[#11151E] border border-[#343B46] px-5 py-3 md:py-0 flex flex-col justify-center items-center flex-1 transition-colors cursor-default">
                <span className="text-[#F29A2E] font-[family-name:var(--font-orbitron)] text-lg mb-1">0.81</span>
                <span className="text-white text-xs whitespace-nowrap">PE Score</span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, borderColor: "#F29A2E" }} className="bg-[#11151E] border border-[#343B46] px-5 py-3 md:py-0 flex flex-col justify-center items-center flex-1 transition-colors cursor-default">
                <span className="text-[#F29A2E] font-[family-name:var(--font-orbitron)] text-lg mb-1">Pass</span>
                <span className="text-white text-xs whitespace-nowrap">GRASP</span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, borderColor: "#F29A2E" }} className="bg-[#11151E] border border-[#343B46] px-5 py-3 md:py-0 flex flex-col justify-center items-center flex-1 transition-colors cursor-default">
                <span className="text-[#F29A2E] font-[family-name:var(--font-orbitron)] text-lg mb-1">704K</span>
                <span className="text-white text-xs whitespace-nowrap">Samples</span>
              </motion.div>
            </div>
          </motion.div>

          {/* ASTRONAUT IMAGE */}
          <motion.div variants={fadeUp} className="flex-shrink-0 relative">
            <motion.img 
              src="/hero/astronaut-space-1.webp" 
              alt="Astronaut" 
              className="w-[500px] max-w-full h-auto transform -rotate-2"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

        </div>

        {/* ROW 1: CRITICAL STATUS & TELEMETRY */}
        <motion.section variants={fadeUp}>
          <h2 className="font-[family-name:var(--font-orbitron)] font-semibold text-2xl text-white mb-8 flex items-center gap-3">
            <span className="bg-[#F29A2E] text-white rounded-none w-8 h-8 flex items-center justify-center text-sm">01</span>
            Critical Status
          </h2>
          
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* STATUS BOARD CARD */}
            <div className="col-span-12 xl:col-span-8 bg-[#11151E] border border-[#343B46] rounded-none p-6 md:p-8 shadow-none hover:border-[#F29A2E] transition-all duration-300 group">
              <div className="flex justify-between items-start mb-8 pb-4 border-b border-[#343B46]">
                <div className="flex items-center gap-3">
                  <div className="bg-isro-orange text-white px-3 py-1 rounded-none font-bold text-xs uppercase tracking-wider">
                    RED ALERT
                  </div>
                  <span className="text-text-muted text-xs uppercase tracking-widest font-medium">HORIZON: {appState.status_horizon}</span>
                </div>
                <div className="text-xs text-text-muted uppercase">Time to impact: {appState.p99_hours_from_now}h</div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                <div className="flex items-center gap-8">
                  <div className="flex flex-col">
                    <span className="text-5xl font-[family-name:var(--font-orbitron)] font-bold text-white mb-2">{appState.prob_p99}%</span>
                    <span className="text-[10px] text-text-muted tracking-widest uppercase">P99 PROBABILITY</span>
                  </div>
                  <div className="w-px h-16 bg-card-border"></div>
                  <div className="flex flex-col">
                    <span className="text-5xl font-[family-name:var(--font-orbitron)] font-bold text-isro-orange mb-2">{appState.kp_index}</span>
                    <span className="text-[10px] text-text-muted tracking-widest uppercase">Kp INDEX</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TELEMETRY FEED CARD */}
            <div className="col-span-12 xl:col-span-4 bg-[#11151E] border border-[#343B46] rounded-none p-6 md:p-8 shadow-none hover:-translate-y-1 hover:border-isro-orange transition-all duration-300 group flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#343B46]">
                <span className="text-text-muted text-sm font-semibold uppercase tracking-widest">Live Telemetry</span>
                <span className="text-isro-cyan flex items-center gap-2 text-xs uppercase tracking-wider font-bold">
                  <motion.span 
                    animate={{ scale: [1, 1.8, 1], opacity: [1, 0.2, 1] }} 
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
                    className="w-2 h-2 bg-isro-cyan rounded-none"
                  ></motion.span>
                  LIVE
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                <div>
                  <div className="text-text-muted text-[10px] tracking-widest mb-2 uppercase">SPEED (km/s)</div>
                  <div className="font-[family-name:var(--font-orbitron)] text-xl text-white font-semibold">
                    {appState.speed}
                  </div>
                </div>
                <div>
                  <div className="text-text-muted text-[10px] tracking-widest mb-2 uppercase">IMF Bz (nT)</div>
                  <div className="font-[family-name:var(--font-orbitron)] text-xl text-white font-semibold">
                    {appState.imf_bz}
                  </div>
                </div>
                <div>
                  <div className="text-text-muted text-[10px] tracking-widest mb-2 uppercase">DENSITY (p/cc)</div>
                  <div className="font-[family-name:var(--font-orbitron)] text-xl text-white font-semibold">
                    {appState.density}
                  </div>
                </div>
                <div>
                  <div className="text-isro-orange text-[10px] font-bold tracking-widest mb-2 uppercase">&gt;2MeV FLUX</div>
                  <div className="font-[family-name:var(--font-orbitron)] text-xl text-white font-semibold">
                    {appState.flux_current.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ROW 2: FORECAST CHART & LOGS */}
        <motion.section variants={fadeUp}>
          <h2 className="font-[family-name:var(--font-orbitron)] font-semibold text-2xl text-white mb-8 flex items-center gap-3">
            <span className="bg-isro-orange text-white rounded-none w-8 h-8 flex items-center justify-center text-sm">02</span>
            Forecast Projection
          </h2>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* MAIN CHART */}
            <div className="col-span-12 xl:col-span-9 bg-[#11151E] border border-[#343B46] rounded-none p-6 md:p-8 shadow-none hover:-translate-y-1 hover:border-isro-orange transition-all duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-[#343B46] gap-4">
                <div className="flex gap-4 items-center">
                  <span className="text-text-muted text-sm tracking-widest uppercase">Log Scale Projection</span>
                </div>
                <button 
                  onClick={() => setShowGrasp(!showGrasp)} 
                  className={`px-4 py-2 rounded-none font-[family-name:var(--font-orbitron)] text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${showGrasp ? 'bg-isro-orange text-white shadow-[0_4px_14px_0_rgba(255,101,0,0.39)] hover:-translate-y-0.5' : 'bg-transparent border border-isro-cyan text-isro-cyan hover:bg-isro-cyan hover:text-white'}`}
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
              <div className="bg-[#11151E] border border-[#343B46] rounded-none p-6 shadow-none hover:-translate-y-1 hover:border-isro-orange transition-all duration-300 flex-grow flex flex-col">
                <div className="text-white font-[family-name:var(--font-orbitron)] font-semibold text-sm uppercase tracking-wider border-b border-[#343B46] pb-3 mb-5">Explainability</div>
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
                
                <div className="text-white font-[family-name:var(--font-orbitron)] font-semibold text-sm uppercase tracking-wider border-b border-[#343B46] pb-3 mb-4 mt-auto">Action Log</div>
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
        </motion.section>

        {/* ROW 3: VALIDATION PANELS */}
        <motion.section variants={fadeUp}>
          <h2 className="font-[family-name:var(--font-orbitron)] font-semibold text-2xl text-white mb-8 flex items-center gap-3">
            <span className="bg-isro-orange text-white rounded-none w-8 h-8 flex items-center justify-center text-sm">03</span>
            Validation Matrix
          </h2>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* ADVANCE WARNING */}
            <div className="bg-[#11151E] border border-[#343B46] rounded-none p-6 shadow-none hover:-translate-y-1 hover:border-isro-orange transition-all duration-300">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#343B46]">
                <span className="font-semibold text-sm text-white uppercase tracking-wider">Advance Warning Profile</span>
              </div>
              <div className="bg-bg-deep rounded-none p-2 border border-[#343B46] h-[350px]">
                <MultiHorizonChart />
              </div>
            </div>

            {/* PEAK CAPTURE */}
            <div className="bg-[#11151E] border border-[#343B46] rounded-none p-6 shadow-none hover:-translate-y-1 hover:border-isro-orange transition-all duration-300">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#343B46]">
                <span className="font-semibold text-sm text-white uppercase tracking-wider">Peak Capture Efficacy</span>
              </div>
              <div className="bg-bg-deep rounded-none p-2 border border-[#343B46] h-[350px]">
                <April2017P90Chart />
              </div>
            </div>

            {/* SHAP IMPORTANCE */}
            <div className="bg-[#11151E] border border-[#343B46] rounded-none p-6 shadow-none hover:-translate-y-1 hover:border-isro-orange transition-all duration-300">
              <div className="mb-6 pb-4 border-b border-[#343B46]">
                <span className="font-semibold text-sm text-white uppercase tracking-wider">Global SHAP Importance</span>
              </div>
              <div className="bg-bg-deep rounded-none p-2 border border-[#343B46] h-[400px]">
                <ShapImportanceChart />
              </div>
            </div>

            {/* SHAP BEESWARM */}
            <div className="bg-[#11151E] border border-[#343B46] rounded-none p-6 shadow-none hover:-translate-y-1 hover:border-isro-orange transition-all duration-300">
              <div className="mb-6 pb-4 border-b border-[#343B46]">
                <span className="font-semibold text-sm text-white uppercase tracking-wider">SHAP Feature Impact</span>
              </div>
              <div className="bg-bg-deep rounded-none p-2 border border-[#343B46] h-[400px]">
                <ShapBeeswarmChart />
              </div>
            </div>
          </div>
        </motion.section>

        {/* ROW 4: BONUS CHART */}
        <motion.section variants={fadeUp}>
          <h2 className="font-[family-name:var(--font-orbitron)] font-semibold text-2xl text-white mb-8 flex items-center gap-3">
            <span className="bg-isro-orange text-white rounded-none w-8 h-8 flex items-center justify-center text-sm">04</span>
            Historical Storm Case Study (April 2017)
          </h2>

          <div className="bg-[#11151E] border border-[#343B46] rounded-none p-6 shadow-none hover:-translate-y-1 hover:border-isro-orange transition-all duration-300">
            <div className="mb-6 pb-4 border-b border-[#343B46]">
              <span className="font-semibold text-sm text-white uppercase tracking-wider">12H Forecast vs Actual - April 2017 Storm</span>
            </div>
            <div className="bg-bg-deep rounded-none p-2 border border-[#343B46] h-[450px]">
              <April2017Chart />
            </div>
          </div>
        </motion.section>

      </motion.div>
    </main>
  );
}
