import { CheckCircle2 } from "lucide-react";

export default function SystemStatus() {
  const statuses = [
    "Model Loaded",
    "Data Verified",
    "Forecast Active",
    "Validation Complete",
    "Export Traceable"
  ];

  return (
    <section className="py-24 bg-[#050816] border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xl font-bold font-mono text-gray-500 mb-8 uppercase tracking-widest text-center">System Status</h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          {statuses.map((status, idx) => (
            <div key={idx} className="flex items-center gap-2 text-gray-300 font-mono text-sm">
              <CheckCircle2 size={16} className="text-success" />
              <span>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
