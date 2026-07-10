export default function CheckoutLoading() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-black pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="h-8 w-48 bg-text rounded-lg animate-pulse mb-4" />
        <div className="h-4 w-72 bg-text/50 rounded animate-pulse mb-16" />
        <div className="space-y-4">
          <div className="h-64 bg-text border border-border-strong rounded-3xl animate-pulse" />
          <div className="h-32 bg-text/50 border border-border-strong/50 rounded-2xl animate-pulse" />
        </div>
      </div>
    </main>
  );
}
