export default function BenchmarkCards() {
  return (
    <section className="py-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Benchmark Comparison</h2>
        <p className="text-gray-400 font-mono text-sm">Different horizons require different strategies.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card border border-gray-800 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gray-600"></div>
          <h3 className="text-white font-bold mb-2">Persistence</h3>
          <p className="text-gray-500 text-sm">Horizon: 45m</p>
          <div className="mt-4 h-2 w-full bg-gray-800 rounded">
            <div className="h-full bg-gray-500 rounded w-3/4"></div>
          </div>
        </div>
        <div className="p-6 bg-card border border-gray-800 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <h3 className="text-white font-bold mb-2">Delta X100</h3>
          <p className="text-gray-500 text-sm">Horizon: 6h - 12h</p>
          <div className="mt-4 h-2 w-full bg-gray-800 rounded">
            <div className="h-full bg-primary rounded w-[85%]"></div>
          </div>
        </div>
        <div className="p-6 bg-card border border-gray-800 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-warning"></div>
          <h3 className="text-white font-bold mb-2">EventWindow</h3>
          <p className="text-gray-500 text-sm">Horizon: Next 12h Block</p>
          <div className="mt-4 h-2 w-full bg-gray-800 rounded">
            <div className="h-full bg-warning rounded w-[95%]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
