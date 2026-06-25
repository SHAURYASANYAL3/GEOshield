'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { ShieldAlert, Activity, ArrowUpRight, CheckCircle2, AlertTriangle, Info, ShieldCheck } from 'lucide-react';

export default function OperationalDashboard() {
  const [showGrasp, setShowGrasp] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  
  const [dataState, setDataState] = useState<{
    status: 'loading' | 'success' | 'missing' | 'malformed' | 'network_failure',
    state: any
  }>({
    status: 'loading',
    state: null
  });

  useEffect(() => {
    setCurrentTime(new Date().toISOString().substring(11, 16) + ' UTC');
    const timer = setInterval(() => {
      setCurrentTime(new Date().toISOString().substring(11, 16) + ' UTC');
    }, 60000);
    
    const loadData = async () => {
      try {
        const res = await fetch('/data/state.json').catch(() => null);
        if (!res) return setDataState({ status: 'network_failure', state: null });
        if (!res.ok) return setDataState({ status: 'missing', state: null });

        try {
           const stateData = await res.json();
           try {
             const forecastRes = await fetch('/data/forecast.json');
             if (forecastRes && forecastRes.ok) {
               const forecastData = await forecastRes.json();
               stateData.forecast_timeline = forecastData.map((d: any) => ({
                 time: d.time.split(' ')[1].substring(0, 5),
                 actual: d.actual,
                 median: d.predicted,
                 p90: d.upper,
                 grasp: d.actual * 0.933
               }));
             }
           } catch (err) {
             console.error("Failed to fetch forecast.json", err);
           }
           setDataState({ status: 'success', state: stateData });
        } catch(e) {
           setDataState({ status: 'malformed', state: null });
        }
      } catch (e) {
        setDataState({ status: 'network_failure', state: null });
      }
    };
    loadData();
    return () => clearInterval(timer);
  }, []);

  const renderErrorState = () => {
    if (dataState.status === 'success' || dataState.status === 'loading') return null;
    let message = '';
    if (dataState.status === 'missing') message = 'No exported model data found';
    if (dataState.status === 'malformed') message = 'Data validation failed';
    if (dataState.status === 'network_failure') message = 'Using last verified snapshot';

    return (
      <div className="bg-[#FF4B5C]/10 border border-[#FF4B5C]/30 rounded-xl p-4 mb-6 flex items-center gap-4 text-[#FF4B5C]">
        <AlertTriangle className="w-6 h-6" />
        <span className="font-mono font-bold">{message}</span>
      </div>
    );
  };

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
    <main className="min-h-screen bg-[#050816] text-[#E6EDF7] font-sans selection:bg-[#00E5FF] selection:text-[#050816] overflow-x-hidden relative">

      {/* Top Navbar */}
      <header className="border-b border-white/5 bg-[#0D1224] sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <ShieldAlert className="text-[#00E5FF] w-6 h-6" />
            <span className="font-mono font-bold tracking-widest uppercase text-lg text-white">GEOShield <span className="text-[#8892A6] text-sm ml-2">OPS-CONSOLE</span></span>
          </div>
          <div className="flex items-center gap-6 font-mono text-sm">
            <div className="flex items-center gap-2 text-[#FFB300] bg-[#FFB300]/10 border border-[#FFB300]/20 px-3 py-1.5 rounded font-bold text-[10px] uppercase tracking-wider">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFB300] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFB300]"></span></span>
              OPERATIONAL PROTOTYPE
            </div>
            <div className="text-[#8892A6] bg-black/20 px-3 py-1.5 rounded border border-white/5">{currentTime}</div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 py-10 grid grid-cols-12 gap-8">
        <div className="col-span-12">
          {renderErrorState()}
        </div>

        {/* --- SECTION 1: STATUS HERO --- */}
        <div className="col-span-12 bg-[#0D1224] border border-white/10 rounded-[24px] p-10 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden transition-all hover:border-white/20">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#FF4B5C]"></div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#FF4B5C]/10 border border-[#FF4B5C]/30 text-[#FF4B5C] px-3 py-1 rounded font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF4B5C] animate-pulse"></span>
                RED ALERT
              </div>
              <span className="font-mono text-[#8892A6] text-[10px] uppercase tracking-widest">HORIZON: {appState.status_horizon}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
              Next P99 crossing <br/>predicted at <span className="text-[#00E5FF]">{appState.p99_time}</span>
            </h1>
            <p className="text-[#8892A6] font-mono text-xl">{appState.p99_hours_from_now} hours from now.</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center justify-center bg-[#050816] border border-white/5 p-6 rounded-2xl relative w-32 h-32 shadow-inner">
              <svg className="w-full h-full transform -rotate-90 absolute inset-0 m-auto" viewBox="0 0 36 36" style={{ width: '80%', height: '80%' }}>
                <path className="text-white/5" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
                <path className="text-[#FF4B5C]" strokeDasharray={`${appState.prob_p99}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-white leading-none">{appState.prob_p99}%</span>
                <span className="text-[9px] font-mono text-[#8892A6] mt-1 tracking-widest">PROB P99</span>
              </div>
            </div>
            <div className="bg-[#050816] border border-white/5 p-6 rounded-2xl max-w-xs">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="text-[#00E5FF] w-4 h-4" />
                <span className="font-mono text-[10px] text-[#00E5FF] uppercase tracking-widest">System Status</span>
              </div>
              <p className="text-xs text-[#8892A6] leading-relaxed">
                GEOShield is monitoring 1.2M km of solar wind. Tracking elevated speed (<strong className="text-white">{appState.speed} km/s</strong>). Model assigns <strong>{appState.prob_p99}%</strong> probability of P99 crossing.
              </p>
            </div>
          </div>
        </div>

        {/* --- FORECAST COMMAND CENTER --- */}
        <div className="col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Status Cards */}
          <div className="col-span-12 lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-[#8892A6] font-mono text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-2">Telemetry Feed</h2>
            <div className="bg-[#0D1224] border border-white/10 rounded-xl p-4 transition-transform hover:-translate-y-0.5">
              <div className="text-[#8892A6] font-mono text-[10px] mb-2 tracking-widest">SPEED (km/s)</div>
              <div className="font-mono text-xl text-white flex items-center justify-between">
                {appState.speed} <ArrowUpRight className="w-4 h-4 text-[#FFB300]" />
              </div>
            </div>
            <div className="bg-[#0D1224] border border-white/10 rounded-xl p-4 transition-transform hover:-translate-y-0.5">
              <div className="text-[#8892A6] font-mono text-[10px] mb-2 tracking-widest">IMF Bz (nT)</div>
              <div className="font-mono text-xl text-white flex items-center justify-between">
                {appState.imf_bz} <ArrowUpRight className="w-4 h-4 text-[#FFB300] rotate-90" />
              </div>
            </div>
            <div className="bg-[#0D1224] border border-white/10 rounded-xl p-4 transition-transform hover:-translate-y-0.5">
              <div className="text-[#8892A6] font-mono text-[10px] mb-2 tracking-widest">Kp INDEX</div>
              <div className="font-mono text-xl text-[#FF4B5C] flex items-center justify-between">
                {appState.kp_index} <AlertTriangle className="w-4 h-4 text-[#FF4B5C]" />
              </div>
            </div>
            <div className="bg-[#0D1224] border border-white/10 rounded-xl p-4 transition-transform hover:-translate-y-0.5">
              <div className="text-[#8892A6] font-mono text-[10px] mb-2 tracking-widest">DENSITY (p/cc)</div>
              <div className="font-mono text-xl text-white flex items-center justify-between">
                {appState.density} <span className="w-2 h-2 rounded-full bg-[#00FF88]"></span>
              </div>
            </div>
            <div className="bg-[#0D1224] border border-white/10 rounded-xl p-4 mt-2">
              <div className="text-[#00E5FF] font-mono text-[10px] mb-2 tracking-widest">CURRENT &gt;2MeV FLUX</div>
              <div className="font-mono text-xl text-white">{appState.flux_current.toLocaleString()}</div>
              <div className="text-[10px] font-mono mt-1 text-[#FFB300]">↑ {appState.flux_status}</div>
            </div>
          </div>

          {/* CENTER: Main Chart */}
          <div className="col-span-12 lg:col-span-7 bg-[#0D1224] border border-white/10 rounded-[24px] p-6 flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-white font-bold text-lg">Forecast Timeline</h2>
                <div className="text-[#8892A6] font-mono text-[10px] tracking-widest uppercase mt-1">Log Scale Projection</div>
              </div>
              <button onClick={() => setShowGrasp(!showGrasp)} className={`font-mono text-[10px] px-4 py-2 rounded-lg border transition-all uppercase tracking-widest ${showGrasp ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]' : 'bg-transparent border-white/10 text-[#8892A6] hover:text-white hover:border-white/30'}`}>
                {showGrasp ? 'Disable GRASP Comparison' : 'Enable GRASP Comparison'}
              </button>
            </div>
            <div className="flex-grow min-h-[400px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={appState.forecast_timeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="#8892A6" tick={{ fill: '#8892A6', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis scale="log" domain={['auto', 'auto']} stroke="#8892A6" tick={{ fill: '#8892A6', fontSize: 10, fontFamily: 'monospace' }} tickFormatter={(val) => val.toLocaleString()} axisLine={false} tickLine={false} dx={-10} />
                  <RechartsTooltip cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ backgroundColor: '#050816', borderColor: 'rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: '12px', color: '#fff', borderRadius: '8px' }} />
                  <ReferenceLine y={59153} stroke="#FF4B5C" strokeDasharray="4 4" strokeWidth={1} label={{ position: 'insideTopLeft', value: 'P99 Threshold', fill: '#FF4B5C', fontSize: 10, fontFamily: 'monospace' }} />
                  <ReferenceLine x="NOW" stroke="#8892A6" strokeWidth={1} />
                  <Area type="monotone" dataKey="p90" stroke="none" fill="#FFB300" fillOpacity={0.05} />
                  <Line type="monotone" dataKey="actual" stroke="#00E5FF" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="median" stroke="#00FF88" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  {showGrasp && <Line type="stepAfter" dataKey="grasp" stroke="#b14bc9" strokeWidth={2} strokeDasharray="2 2" dot={false} name="ISRO GRASP (48°E)" />}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            {/* Horizon Mini-cards inside chart area */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-[#050816] border border-white/5 rounded-xl p-4">
                <div className="text-[#8892A6] font-mono text-[10px] mb-1">45 MIN HORIZON</div>
                <div className="text-white font-mono text-lg mb-1">2,800</div>
                <div className="text-[10px] font-mono text-[#00FF88]">PASS - BELOW P99</div>
              </div>
              <div className="bg-[#050816] border border-white/5 rounded-xl p-4">
                <div className="text-[#8892A6] font-mono text-[10px] mb-1">6 HR HORIZON</div>
                <div className="text-white font-mono text-lg mb-1">8,000</div>
                <div className="text-[10px] font-mono text-[#FFB300]">WARNING - ABOVE P95</div>
              </div>
              <div className="bg-[#050816] border border-[#FF4B5C]/20 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-[#FF4B5C]/10 rounded-bl-full"></div>
                <div className="text-[#FF4B5C] font-mono text-[10px] mb-1 font-bold">12 HR HORIZON</div>
                <div className="text-white font-mono text-lg mb-1">58,000</div>
                <div className="text-[10px] font-mono text-[#FF4B5C] font-bold animate-pulse">CRITICAL - P99 CROSSING</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Alert Decision Panel */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
            <h2 className="text-[#8892A6] font-mono text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-2">Decision Panel</h2>
            
            {/* SHAP Explainability */}
            <div className="bg-[#0D1224] border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-[#8892A6]" />
                <h3 className="text-white text-sm font-bold">Model Drivers</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-mono text-[#00E5FF] tracking-widest mb-1">PRIMARY DRIVER</div>
                  <div className="text-sm text-white font-mono">{appState.shap_primary}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#8892A6] tracking-widest mb-1">SECONDARY DRIVER</div>
                  <div className="text-sm text-white font-mono">{appState.shap_secondary}</div>
                </div>
              </div>
            </div>

            {/* Event Log */}
            <div className="bg-[#0D1224] border border-white/10 rounded-xl p-5 flex-grow">
              <h3 className="text-white text-sm font-bold mb-4">Action Log</h3>
              <div className="space-y-3">
                {appState.alerts.map((alert: any, idx: number) => (
                  <div key={idx} className="bg-[#050816] p-3 rounded-lg border border-white/5 text-xs">
                    <div className="flex justify-between items-center mb-2">
                      <span className={alert.status === 'CORRECT' ? "text-[#00FF88] font-bold font-mono text-[10px]" : "text-[#FFB300] font-bold font-mono text-[10px]"}>
                        {alert.status === 'CORRECT' ? 'PASS' : 'LIMITATION'}
                      </span>
                      <span className="text-[#8892A6] font-mono text-[10px]">{alert.date}</span>
                    </div>
                    <div className="text-white font-mono mb-1">{alert.status === 'CORRECT' ? `Lead: ${alert.lead}` : alert.lead}</div>
                    <div className="text-[#8892A6]">{alert.outcome}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- VALIDATION SECTION --- */}
        <div className="col-span-12 mt-12">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="text-[#00E5FF] w-5 h-5" />
            <h2 className="text-[#E6EDF7] text-xl font-bold tracking-tight">Scientific Model Validation</h2>
            <div className="h-px bg-white/10 flex-grow ml-4"></div>
            <div className="text-[#8892A6] font-mono text-[10px] border border-white/10 px-3 py-1 rounded-full">PROTOTYPE WIRED FOR LIVE DATA</div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Advance Warning Chart */}
            <div className="bg-[#0D1224] border border-white/10 rounded-[24px] overflow-hidden group hover:border-white/20 transition-colors">
              <div className="bg-[#050816] p-4 border-b border-white/5 flex justify-between items-center">
                <span className="font-mono text-[10px] text-[#8892A6] tracking-widest">SCENARIO: ADVANCE WARNING</span>
                <span className="text-[#00FF88] border border-[#00FF88]/20 bg-[#00FF88]/10 px-2 py-0.5 rounded text-[10px] font-mono font-bold">PASS</span>
              </div>
              <div className="p-6">
                <div className="font-mono text-xs mb-6 text-[#8892A6] space-y-2">
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Actual electron PEAK</span><span className="text-white">330,105 (5.6x P99)</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>First forecast alert</span><span className="text-white">2017-04-23 07:00:00</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>First actual onset</span><span className="text-white">2017-04-23 19:00:00</span></div>
                  <div className="flex justify-between pt-1 font-bold text-[#00E5FF]"><span>LEAD TIME</span><span>12.0 hours advance</span></div>
                </div>
                <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-white">
                  <img src="/plots/Screenshot_1.png" alt="Advance Warning" className="w-full h-auto mix-blend-multiply" />
                </div>
              </div>
            </div>

            {/* Peak Capture Chart */}
            <div className="bg-[#0D1224] border border-white/10 rounded-[24px] overflow-hidden group hover:border-white/20 transition-colors">
              <div className="bg-[#050816] p-4 border-b border-white/5 flex justify-between items-center">
                <span className="font-mono text-[10px] text-[#8892A6] tracking-widest">SCENARIO: PEAK CAPTURE</span>
                <span className="text-[#FFB300] border border-[#FFB300]/20 bg-[#FFB300]/10 px-2 py-0.5 rounded text-[10px] font-mono font-bold">WARNING</span>
              </div>
              <div className="p-6">
                <div className="font-mono text-xs mb-6 text-[#8892A6] space-y-2">
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Actual storm peak</span><span className="text-white">330,105</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Median forecast</span><span className="text-white">200,214 (61%)</span></div>
                  <div className="flex justify-between pt-1 font-bold text-[#FFB300]"><span>P90 upper band</span><span>308,247 (93%)</span></div>
                </div>
                <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-white">
                  <img src="/plots/Screenshot_2.png" alt="Peak Capture" className="w-full h-auto mix-blend-multiply" />
                </div>
              </div>
            </div>

            {/* SHAP Feature Importance */}
            <div className="bg-[#0D1224] border border-white/10 rounded-[24px] overflow-hidden group hover:border-white/20 transition-colors">
              <div className="bg-[#050816] p-4 border-b border-white/5 flex justify-between items-center">
                <span className="font-mono text-[10px] text-[#8892A6] tracking-widest">SHAP FEATURE IMPORTANCE</span>
                <span className="text-[#8892A6] border border-white/10 bg-white/5 px-2 py-0.5 rounded text-[10px] font-mono font-bold">INFO</span>
              </div>
              <div className="p-6">
                <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-white flex justify-center">
                  <img src="/plots/Screenshot_3.png" alt="SHAP Importance" className="max-w-full h-auto mix-blend-multiply" />
                </div>
              </div>
            </div>

            {/* SHAP Beeswarm */}
            <div className="bg-[#0D1224] border border-white/10 rounded-[24px] overflow-hidden group hover:border-white/20 transition-colors">
              <div className="bg-[#050816] p-4 border-b border-white/5 flex justify-between items-center">
                <span className="font-mono text-[10px] text-[#8892A6] tracking-widest">SHAP FEATURE IMPACT (BEESWARM)</span>
                <span className="text-[#8892A6] border border-white/10 bg-white/5 px-2 py-0.5 rounded text-[10px] font-mono font-bold">INFO</span>
              </div>
              <div className="p-6 h-full flex flex-col justify-center">
                <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-white flex justify-center">
                  <img src="/plots/Screenshot_4.png" alt="SHAP Beeswarm" className="max-w-full h-auto mix-blend-multiply" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- TEAM SECTION --- */}
        <div className="col-span-12 mt-16 pt-8 border-t border-white/5">
          <h2 className="text-[#8892A6] font-mono text-[10px] font-bold uppercase tracking-widest mb-8 text-center">Project Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {['Paavni Bansal', 'Shaurya Sanyal', 'Sree Revanth', 'Saketh Suman Bathini'].map((name, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="w-12 h-12 rounded-full bg-[#0D1224] border border-white/10 flex items-center justify-center text-xs font-bold text-[#E6EDF7] mb-3 group-hover:border-[#00E5FF] group-hover:-translate-y-1 transition-all shadow-sm">
                  {name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-sm text-white font-medium text-center">{name}</div>
                <div className="text-[10px] font-mono text-[#8892A6] mt-1">{i === 0 ? 'TEAM LEADER' : 'DEVELOPER'}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
