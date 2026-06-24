export default function Mission() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Mission</h2>
          <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Early warning matters more than exact amplitude.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 bg-card rounded-xl border border-gray-800">
            <div className="text-4xl mb-4">☀️</div>
            <h3 className="text-xl font-bold text-white">Solar Wind</h3>
            <p className="text-gray-500 mt-2">Coronal mass ejections and high-speed streams impact Earth.</p>
          </div>
          <div className="p-8 bg-card rounded-xl border border-gray-800">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-white">Magnetosphere</h3>
            <p className="text-gray-500 mt-2">Radiation belts flood with killer electrons.</p>
          </div>
          <div className="p-8 bg-card rounded-xl border border-primary/30 shadow-[0_0_30px_rgba(0,229,255,0.1)]">
            <div className="text-4xl mb-4">🛰️</div>
            <h3 className="text-xl font-bold text-white">GEOShield</h3>
            <p className="text-gray-500 mt-2">Detects the buildup and alerts operators 12h in advance.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
