import ForecastChart from '@/components/ForecastChart';
import AlertPanel from '@/components/AlertPanel';
import ModelBrain from '@/components/ModelBrain';

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
            <div className="p-6 bg-card border border-gray-800 rounded-xl hover:-translate-y-1 transition-transform">
              <div className="text-gray-500 text-sm font-mono mb-1">Current Risk</div>
              <div className="text-warning font-bold text-xl">ELEVATED</div>
            </div>
            <div className="p-6 bg-card border border-gray-800 rounded-xl hover:-translate-y-1 transition-transform">
              <div className="text-gray-500 text-sm font-mono mb-1">Forecast Horizon</div>
              <div className="text-white font-bold text-xl">12 Hours</div>
            </div>
            
            {/* Confidence Layer */}
            <div className="p-6 bg-card border border-gray-800 rounded-xl hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className="text-gray-500 text-sm font-mono mb-1">Prediction</div>
                  <div className="text-warning font-bold text-xl">HIGH</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500 text-sm font-mono mb-1">Confidence</div>
                  <div className="text-primary font-bold text-xl">82%</div>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden flex">
                <div className="h-full bg-primary" style={{ width: '82%' }}></div>
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-mono text-gray-600 uppercase">
                <span>Low Certainty</span>
                <span>High Certainty</span>
              </div>
            </div>
            
            <div className="p-6 bg-card border border-gray-800 rounded-xl hover:-translate-y-1 transition-transform">
              <div className="text-gray-500 text-sm font-mono mb-1">Model</div>
              <div className="text-primary font-bold text-xl">XGB EventWindow</div>
            </div>
          </div>

          {/* Center Column */}
          <div className="lg:col-span-2">
            <ForecastChart />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <AlertPanel />
            <ModelBrain />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-white mb-6">Recent Events Table</h3>
          <div className="w-full overflow-x-auto bg-card border border-gray-800 rounded-xl hover:-translate-y-1 transition-transform">
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
