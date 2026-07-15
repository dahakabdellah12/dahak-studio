export default function ProjectDetailLoading() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-4 h-4 w-24 animate-pulse rounded bg-secondary" />

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-10 w-64 animate-pulse rounded bg-secondary" />
            <div className="h-4 w-20 animate-pulse rounded bg-secondary" />
          </div>
          <div className="h-6 w-24 animate-pulse rounded-full bg-secondary" />
        </div>

        <div className="mt-4 space-y-2">
          <div className="h-4 w-96 animate-pulse rounded bg-secondary" />
          <div className="h-4 w-72 animate-pulse rounded bg-secondary" />
        </div>

        <div className="mt-6 flex gap-2">
          <div className="h-10 w-28 animate-pulse rounded-xl bg-secondary" />
          <div className="h-10 w-28 animate-pulse rounded-xl bg-secondary" />
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-video animate-pulse rounded-xl bg-secondary/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
