'use client';
import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

export default function ScenarioMode() {
  const [scenario, setScenario] = useState('moderate');
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState(0); // 0: Idle, 1: T-12h, 2: T-6h, 3: T-1h, 4: Impact

  const scenarios: any = {
    quiet: {
      name: 'Quiet Day',
      stages: [
        { label: 'T-12h', risk: 'NORMAL', prob: '2%', alert: 'CLEAR', color: 'text-success', border: 'border-success' },
        { label: 'T-6h', risk: 'NORMAL', prob: '1%', alert: 'CLEAR', color: 'text-success', border: 'border-success' },
        { label: 'T-1h', risk: 'NORMAL', prob: '1%', alert: 'CLEAR', color: 'text-success', border: 'border-success' },
        { label: 'Impact', risk: 'NORMAL', prob: '0%', alert: 'CLEAR', color: 'text-success', border: 'border-success' },
      ]
    },
    moderate: {
      name: 'Moderate Storm',
      stages: [
        { label: 'T-12h', risk: 'WATCH', prob: '15%', alert: 'CLEAR', color: 'text-gray-300', border: 'border-gray-600' },
        { label: 'T-6h', risk: 'ELEVATED', prob: '45%', alert: 'WATCH', color: 'text-warning', border: 'border-warning' },
        { label: 'T-1h', risk: 'HIGH', prob: '78%', alert: 'ACTIVE', color: 'text-danger', border: 'border-danger' },
        { label: 'Impact', risk: 'HIGH', prob: '92%', alert: 'ACTIVE', color: 'text-danger', border: 'border-danger' },
      ]
    },
    extreme: {
      name: 'Extreme Storm',
      stages: [
        { label: 'T-12h', risk: 'ELEVATED', prob: '55%', alert: 'WATCH', color: 'text-warning', border: 'border-warning' },
        { label: 'T-6h', risk: 'HIGH', prob: '85%', alert: 'ACTIVE', color: 'text-danger', border: 'border-danger' },
        { label: 'T-1h', risk: 'EXTREME', prob: '99%', alert: 'CRITICAL', color: 'text-danger', border: 'border-danger' },
        { label: 'Impact', risk: 'EXTREME', prob: '99%', alert: 'CRITICAL', color: 'text-danger', border: 'border-danger' },
      ]
    }
  };

  useEffect(() => {
    if (running && stage < 4) {
      const timer = setTimeout(() => {
        setStage(stage + 1);
      }, 1500); // 1.5 seconds per stage
      return () => clearTimeout(timer);
    } else if (stage === 4) {
      setTimeout(() => setRunning(false), 500);
    }
  }, [running, stage]);

  const runScenario = () => {
    setStage(1);
    setRunning(true);
  };

  const currentStage = stage === 0 ? scenarios[scenario].stages[0] : scenarios[scenario].stages[stage - 1];

  return (
    <section className="py-12 border-b border-gray-800">
      <h2 className="text-2xl font-bold text-white mb-6">Scenario Simulator</h2>
      <div className={`w-full bg-[#0a0f24] p-8 rounded-xl border ${currentStage.border} transition-colors duration-1000 shadow-xl`}>
        
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-8 pb-8 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <select 
              value={scenario}
              onChange={(e) => { setScenario(e.target.value); setStage(0); setRunning(false); }}
              disabled={running}
              className="bg-gray-900 border border-gray-700 text-white p-3 rounded font-mono disabled:opacity-50"
            >
              <option value="quiet">Quiet Day</option>
              <option value="moderate">Moderate Storm</option>
              <option value="extreme">Extreme Storm</option>
            </select>
            <button 
              onClick={runScenario}
              disabled={running}
              className="flex items-center gap-2 bg-primary text-[#050816] px-6 py-3 font-bold rounded hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <Play size={18} />
              Run Scenario
            </button>
          </div>
          
          <div className="text-3xl font-mono font-bold text-white tracking-widest w-32 text-center">
            {stage === 0 ? 'IDLE' : currentStage.label}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-gray-500 font-mono text-sm mb-2">Predicted Risk</div>
            <div className={`text-4xl font-bold ${currentStage.color} transition-colors duration-1000`}>{currentStage.risk}</div>
          </div>
          <div className="md:border-l md:border-r border-gray-800">
            <div className="text-gray-500 font-mono text-sm mb-2">Event Probability</div>
            <div className="text-4xl font-bold text-white transition-all duration-1000">{currentStage.prob}</div>
          </div>
          <div>
            <div className="text-gray-500 font-mono text-sm mb-2">Alert State</div>
            <div className={`text-4xl font-bold ${currentStage.color} transition-colors duration-1000`}>{currentStage.alert}</div>
          </div>
        </div>

      </div>
    </section>
  );
}
