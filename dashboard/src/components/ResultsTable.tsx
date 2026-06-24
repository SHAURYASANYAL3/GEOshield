export default function ResultsTable() {
  const rows = [
    { metric: "Lead Time", baseline: "1.5h (REFM)", geoshield: "12h", status: "🟢" },
    { metric: "Precision", baseline: "~50%", geoshield: "91%", status: "🟢" },
    { metric: "Recall", baseline: "~60%", geoshield: "90%", status: "🟢" },
    { metric: "PR-AUC", baseline: "0.62", geoshield: "0.81", status: "🟢" },
    { metric: "Event Recall", baseline: "N/A", geoshield: "97%", status: "🟢" },
    { metric: "LogRMSE", baseline: "0.78", geoshield: "0.81", status: "🟡" },
  ];

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-white mb-6">Results Matrix</h2>
      <div className="w-full overflow-x-auto bg-card border border-gray-800 rounded-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-900 border-b border-gray-800 text-gray-400 font-mono text-sm uppercase">
            <tr>
              <th className="p-4">Metric</th>
              <th className="p-4">Baseline (NOAA)</th>
              <th className="p-4">GEOShield</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-800">
                <td className="p-4 font-bold">{r.metric}</td>
                <td className="p-4 text-gray-500 font-mono">{r.baseline}</td>
                <td className="p-4 text-primary font-bold font-mono">{r.geoshield}</td>
                <td className="p-4 text-center text-xl">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
