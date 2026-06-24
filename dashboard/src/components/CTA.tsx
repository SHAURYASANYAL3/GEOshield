import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-32 bg-background border-t border-gray-900 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 blur-[100px] rounded-full"></div>
      <div className="relative z-10">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Built for operational awareness.<br/>Validated for reality.</h2>
        <Link href="/forecast" className="inline-block mt-8 px-10 py-5 bg-primary text-background font-bold text-lg rounded hover:bg-primary/90 transition-all">
          Open Forecast Console
        </Link>
      </div>
    </section>
  );
}
