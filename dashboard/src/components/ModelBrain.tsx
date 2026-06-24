import { BrainCircuit, TrendingUp, TrendingDown, Clock, Activity } from 'lucide-react';

export default function ModelBrain() {
  return (
    <div className="w-full bg-card p-6 rounded-xl border border-gray-800 shadow-xl flex flex-col gap-6 mt-8 lg:mt-0">
      <div className="flex items-center gap-3 bg-primary/10 p-3 rounded-lg border border-primary/20">
        <BrainCircuit className="text-primary" size={20} />
        <span className="text-primary font-bold tracking-widest uppercase">Model Brain</span>
      </div>
      
      <div className="space-y-4 flex-grow">
        <div className="text-sm font-mono text-gray-500 mb-2">Top Drivers (Selected Point)</div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 p-3 rounded border border-gray-800 flex items-center justify-between">
            <span className="text-gray-400 text-xs flex items-center gap-1"><Activity size={12}/> Speed</span>
            <TrendingUp size={14} className="text-warning" />
          </div>
          <div className="bg-gray-900 p-3 rounded border border-gray-800 flex items-center justify-between">
            <span className="text-gray-400 text-xs flex items-center gap-1"><TrendingDown size={12}/> Bz</span>
            <TrendingDown size={14} className="text-danger" />
          </div>
          <div className="bg-gray-900 p-3 rounded border border-gray-800 flex items-center justify-between">
            <span className="text-gray-400 text-xs flex items-center gap-1"><TrendingUp size={12}/> Pressure</span>
            <TrendingUp size={14} className="text-warning" />
          </div>
          <div className="bg-gray-900 p-3 rounded border border-gray-800 flex items-center justify-between">
            <span className="text-gray-400 text-xs flex items-center gap-1"><Clock size={12}/> History</span>
            <TrendingUp size={14} className="text-warning" />
          </div>
        </div>
      </div>
      
      <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-primary">
        <p className="text-sm text-gray-300">
          Event probability increased due to <span className="text-white font-bold">elevated solar wind speed</span> and <span className="text-white font-bold">prior flux state</span>.
        </p>
      </div>
    </div>
  );
}
