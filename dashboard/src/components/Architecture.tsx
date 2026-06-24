export default function Architecture() {
  const steps = ["GOES", "OMNI", "Delta", "EventWindow", "Alert"];
  return (
    <section className="py-24 bg-[#0a0f1c]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-16 text-center">Architecture</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center w-full">
              <div className="flex-1 p-6 bg-card border border-gray-800 rounded-xl text-center hover:-translate-y-2 transition-transform cursor-default">
                <span className="font-mono text-primary font-bold">{step}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block w-8 h-px bg-gray-700 mx-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
