'use client';
import { motion } from 'framer-motion';

export default function ValidationHero() {
  const cards = ["🛰 GOES Validation", "🇮🇳 GRASP Validation", "🧪 Event Detection", "📈 Calibration"];
  
  return (
    <section className="py-12 border-b border-gray-800">
      <div className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Evidence & Validation</h1>
        <p className="text-xl text-gray-400 font-mono">Performance is only meaningful if it survives reality.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="p-6 bg-card border border-gray-800 rounded-xl text-center shadow-lg"
          >
            <div className="text-white font-bold">{c}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
