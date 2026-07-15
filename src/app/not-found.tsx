import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue/10 text-4xl font-bold text-blue">
        404
      </div>
      <h1 className="text-3xl font-bold tracking-tight">الصفحة غير موجودة</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 items-center gap-2 rounded-xl bg-blue px-5 text-sm font-medium text-white shadow-lg shadow-blue/25 transition-all hover:bg-blue-light hover:scale-[1.02] active:scale-[0.98]"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
