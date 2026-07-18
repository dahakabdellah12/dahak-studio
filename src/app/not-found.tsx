import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded border border-magenta/30 bg-magenta/5 text-4xl font-bold text-magenta shadow-[0_0_30px_rgba(255,42,109,0.15)]">
        404
      </div>
      <h1 className="text-3xl font-bold tracking-tight">الصفحة غير موجودة</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 items-center gap-2 rounded border border-cyan/40 bg-cyan/10 px-5 text-sm font-medium text-cyan transition-all hover:bg-cyan/20 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
