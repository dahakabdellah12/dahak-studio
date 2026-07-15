export default function ProjectsLoading() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 space-y-3">
          <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
          <div className="h-10 w-48 animate-pulse rounded bg-secondary" />
          <div className="h-4 w-72 animate-pulse rounded bg-secondary" />
        </div>

        <div className="mb-8 h-12 w-full animate-pulse rounded-xl bg-secondary" />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="aspect-video animate-pulse bg-secondary/50" />
              <div className="space-y-3 p-5">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-32 animate-pulse rounded bg-secondary" />
                  <div className="h-5 w-16 animate-pulse rounded bg-secondary" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-full animate-pulse rounded bg-secondary" />
                  <div className="h-3 w-3/4 animate-pulse rounded bg-secondary" />
                </div>
                <div className="flex gap-1.5">
                  <div className="h-5 w-14 animate-pulse rounded bg-secondary" />
                  <div className="h-5 w-14 animate-pulse rounded bg-secondary" />
                  <div className="h-5 w-14 animate-pulse rounded bg-secondary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
