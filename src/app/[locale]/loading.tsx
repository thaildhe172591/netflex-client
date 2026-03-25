export default function RootLoading() {
  return (
    <div className="space-y-6 p-6 md:p-10">
      <div className="h-10 w-56 rounded-full skeleton-shimmer" />
      <div className="h-[38vh] rounded-3xl skeleton-shimmer" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="aspect-[2/3] rounded-2xl skeleton-shimmer" />
        ))}
      </div>
    </div>
  );
}
