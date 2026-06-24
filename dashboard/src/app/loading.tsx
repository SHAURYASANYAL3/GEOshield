export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-12">
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-12 bg-card w-1/3 rounded border border-gray-800"></div>
        <div className="h-4 bg-card w-1/2 rounded border border-gray-800"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-12">
          <div className="h-32 bg-card rounded-xl border border-gray-800"></div>
          <div className="h-32 bg-card rounded-xl border border-gray-800"></div>
          <div className="h-32 bg-card rounded-xl border border-gray-800"></div>
          <div className="h-32 bg-card rounded-xl border border-gray-800"></div>
        </div>
        <div className="h-[400px] bg-card w-full rounded-xl border border-gray-800 mt-8"></div>
      </div>
    </div>
  );
}
