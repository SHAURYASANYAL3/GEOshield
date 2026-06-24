import { AlertTriangle, Clock, ShieldAlert } from "lucide-react";

export default function AlertPanel() {
  return (
    <div className="w-full bg-card p-6 rounded-xl border border-warning shadow-[0_0_15px_rgba(255,179,0,0.15)] flex flex-col gap-6 h-full">
      <div className="flex items-center gap-3 bg-warning/10 p-3 rounded-lg border border-warning/20">
        <span className="h-3 w-3 bg-warning rounded-full shadow-[0_0_8px_rgba(255,179,0,0.8)]"></span>
        <span className="text-warning font-bold tracking-widest uppercase">System Watch</span>
      </div>
      
      <div className="space-y-4 flex-grow">
        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
          <span className="text-gray-400 font-mono text-sm flex items-center gap-2"><Clock size={14}/> Threshold ETA</span>
          <span className="text-white font-bold text-lg">11h 45m</span>
        </div>
        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
          <span className="text-gray-400 font-mono text-sm flex items-center gap-2"><AlertTriangle size={14}/> Predicted Peak</span>
          <span className="text-warning font-bold text-lg">8,200 pfu</span>
        </div>
        <div className="flex justify-between items-center pb-2">
          <span className="text-gray-400 font-mono text-sm flex items-center gap-2"><ShieldAlert size={14}/> Action</span>
          <span className="text-white font-mono text-sm bg-gray-800 px-2 py-1 rounded">Prepare Safemode</span>
        </div>
      </div>
      <button className="w-full py-3 bg-warning text-[#050816] font-bold rounded hover:bg-warning/90 transition-colors">
        ACKNOWLEDGE
      </button>
    </div>
  );
}
