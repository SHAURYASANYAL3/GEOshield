export default function ClaimCard() {
  return (
    <section className="py-24 flex justify-center">
      <div className="max-w-2xl w-full p-12 bg-gradient-to-br from-[#0D1224] to-black border border-primary/20 rounded-2xl shadow-[0_0_50px_rgba(0,229,255,0.05)] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        <div className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-6">What GEOShield Actually Claims</div>
        <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
          Operational hazard awareness,<br/>
          <span className="text-gray-500">not exact peak magnitude prediction.</span>
        </h2>
      </div>
    </section>
  );
}
