"use client";

export default function ProjectDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 rounded border border-magenta/20 bg-magenta/10 px-3 py-1 text-xs font-bold tracking-[0.2em] text-magenta uppercase font-mono">
        ERROR // 0x4042
      </div>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground/90 sm:text-4xl">
        فشل في تحميل تفاصيل المشروع
      </h2>
      <p className="mt-3 max-w-md text-muted-foreground/70">
        تعذرت الاتصال بخادم المشاريع. يرجى المحاولة مرة أخرى.
      </p>
      <button
        onClick={reset}
        className="mt-8 cursor-pointer rounded border border-cyan/30 bg-cyan/10 px-6 py-2.5 text-sm font-medium text-cyan transition-all hover:border-cyan/50 hover:bg-cyan/20"
      >
        إعادة المحاولة
      </button>
    </section>
  );
}
