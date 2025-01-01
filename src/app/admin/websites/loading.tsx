export default function Loading() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Pending Websites</h1>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border p-4 rounded-lg animate-pulse">
            <div className="h-5 bg-muted rounded w-1/4 mb-2" />
            <div className="h-4 bg-muted rounded w-1/3 mb-4" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
} 