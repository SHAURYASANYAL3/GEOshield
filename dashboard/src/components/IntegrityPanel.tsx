export default function IntegrityPanel() {
  const checks = [
    { name: "Split Before Features", verified: true },
    { name: "Split Before EventWindow", verified: true },
    { name: "Temporal Isolation", verified: true },
    { name: "Real GOES Data", verified: true },
    { name: "GRASP Holdout", verified: true }
  ];

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-white mb-6">Leakage & Integrity</h2>
      <div className="p-8 bg-card border border-gray-800 rounded-xl">
        <ul className="space-y-4 font-mono">
          {checks.map((c, i) => (
            <li key={i} className="flex items-center gap-4">
              <span className="text-success text-xl">☑</span>
              <span className="text-gray-300">{c.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
