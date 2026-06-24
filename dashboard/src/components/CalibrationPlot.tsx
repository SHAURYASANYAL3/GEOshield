export default function CalibrationPlot() {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-white mb-6">Confidence Calibration</h2>
      <div className="p-8 bg-card border border-gray-800 rounded-xl flex flex-col items-center">
        <div className="w-full max-w-md aspect-square border-l-2 border-b-2 border-gray-700 relative mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Perfect calibration line */}
            <div className="absolute w-[140%] h-[2px] bg-gray-600 rotate-[-45deg] origin-bottom-left bottom-0 left-0 border-dashed border"></div>
            {/* Model calibration curve */}
            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100">
              <path d="M 0,100 Q 20,80 50,50 T 100,0" fill="none" stroke="#00E5FF" strokeWidth="3" />
            </svg>
          </div>
          <div className="absolute -bottom-6 w-full text-center text-gray-500 font-mono text-xs">Predicted Probability</div>
          <div className="absolute -left-20 top-1/2 -rotate-90 text-gray-500 font-mono text-xs">Observed Frequency</div>
        </div>
        <p className="text-primary font-mono text-center">80% confidence produced 77–80% observed success.</p>
      </div>
    </section>
  );
}
