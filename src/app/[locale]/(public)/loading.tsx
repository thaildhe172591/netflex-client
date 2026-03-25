export default function PublicLoading() {
  return (
    <div className="space-y-8">
      <section className="h-[68vh] rounded-3xl skeleton-shimmer" />
      <section className="space-y-4">
        <div className="h-7 w-44 rounded-full skeleton-shimmer" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="aspect-[2/3] rounded-2xl skeleton-shimmer" />
          ))}
        </div>
      </section>
    </div>
  );
}
