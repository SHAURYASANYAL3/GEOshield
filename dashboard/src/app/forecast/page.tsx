import ForecastChart from '@/components/ForecastChart';
import AlertPanel from '@/components/AlertPanel';

export default function ForecastPage() {
  return (
    <main className="min-h-screen bg-background p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="border-b border-gray-800 pb-6">
          <h1 className="text-3xl font-bold text-white font-mono uppercase tracking-widest">Operational Console</h1>
          <p className="text-gray-500 mt-2">Real-time radiation hazard forecasting</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-6 bg-card border border-gray-800 rounded-xl">
              <div className="text-gray-500 text-sm font-mono mb-1">Current Risk</div>
              <div className="text-warning font-bold text-xl">ELEVATED</div>
            </div>
            <div className="p-6 bg-card border border-gray-800 rounded-xl">
              <div className="text-gray-500 text-sm font-mono mb-1">Forecast Horizon</div>
              <div className="text-white font-bold text-xl">12 Hours</div>
            </div>
            <div className="p-6 bg-card border border-gray-800 rounded-xl">
              <div className="text-gray-500 text-sm font-mono mb-1">Confidence</div>
              <div className="text-white font-bold text-xl">80% Band</div>
            </div>
            <div className="p-6 bg-card border border-gray-800 rounded-xl">
              <div className="text-gray-500 text-sm font-mono mb-1">Model</div>
              <div className="text-primary font-bold text-xl">Delta X100</div>
            </div>
          </div>

          {/* Center Column */}
          <div className="lg:col-span-2">
            <ForecastChart />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <AlertPanel />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-white mb-6">Recent Events Table</h3>
          <div className="w-full overflow-x-auto bg-card border border-gray-800 rounded-xl">
            <table className="w-full text-left">
              <thead className="bg-gray-900 border-b border-gray-800 text-gray-400 font-mono text-sm">
                <tr>
                  <th className="p-4">Event</th>
                  <th className="p-4">Lead</th>
                  <th className="p-4">Severity</th>
                </tr>
              </thead>
              <tbody className="text-white">
                <tr className="border-b border-gray-800">
                  <td className="p-4">April 2017</td>
                  <td className="p-4">12h</td>
                  <td className="p-4 text-danger font-bold">EXTREME</td>
                </tr>
                <tr>
                  <td className="p-4">Sep 2017</td>
                  <td className="p-4">9h</td>
                  <td className="p-4 text-warning font-bold">HIGH</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
