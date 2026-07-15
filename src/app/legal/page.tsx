"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LegalPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            الرجوع
          </Link>

          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            الشروط والأحكام
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            آخر تحديث: 15 يوليو 2026
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 space-y-8 text-muted-foreground leading-relaxed"
        >
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              الموافقة على الشروط
            </h2>
            <p>
              بدخولك إلى موقع <strong className="text-foreground">DAHAK Studio</strong> (
              <a href="https://dahak-studio.vercel.app" className="text-blue hover:underline" target="_blank" rel="noopener noreferrer">
                dahak-studio.vercel.app
              </a>
              )، فإنك توافق تلقائياً على جميع الشروط والأحكام والسياسات المذكورة في هذه الصفحة. إذا لم توافق على أي من هذه الشروط، يُرجى عدم استخدام الموقع.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              الاستخدام
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>هذا الموقع شخصي ويعرض مشاريع وأعمال Developper واحد.</li>
              <li>المحتوى المعروض (نصوص، صور، أكواد) هو ملكية فكرية لصاحب الموقع ما لم يُذكر خلاف ذلك.</li>
              <li>يُسمح بالاطلاع على المشاريع المفتوحة المصدر وفقاً للترخيص الخاص بكل مشروع.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              المشاريع مفتوحة المصدر
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>المشاريع المنشورة على GitHub بمفتوحة المصدر تُخضع للتراخيص المحددة في مستودعاتها.</li>
              <li>يمكنك استخدام وتعديل ونشر المشاريع مفتوحة المصدر وفقاً للترخيص المذكور (مثل MIT أو GPL).</li>
              <li>يُطلب ذكر المصدر عند استخدام أو إعادة توزيع أي مشروع مفتوح المصدر.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              الخصوصية
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>الموقع لا يجمع أي بيانات شخصية من الزوار.</li>
              <li>لا توجد ملفات تعريف ارتباط (Cookies) تُستخدم لتتبع الزوار.</li>
              <li>ملفات تعريف ارتباط الداشبورد تُستخدم فقط للمصادقة ولا تُشارك مع أطراف ثالثة.</li>
              <li>قد تُجمع بعض البيانات التقنية بشكل مجهول عبر خدمات الاستضافة.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              المسؤولية
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>الموقع يُقدم &ldquo;كما هو&rdquo; دون أي ضمانات صريحة أو ضمنية.</li>
              <li>صاحب الموقع غير مسؤول عن أي أضرار ناتجة عن استخدام الموقع أو محتواه.</li>
              <li>روابط المواقع الخارجية ليست تحت السيطرة ولا نتحمل مسؤولية محتواها.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              التعديلات
            </h2>
            <p>
              يحتفظ صاحب الموقع بحق تعديل هذه الشروط والأحكام في أي وقت دون إشعار مسبق. التعديلات تدخل حيز التنفيذ فور نشرها على هذه الصفحة. استمرارك في استخدام الموقع بعد التعديلات يُعتبر موافقة على الشروط المعدّلة.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              التواصل
            </h2>
            <p>
              لأي استفسارات حول هذه الشروط، يمكنك التواصل عبر{" "}
              <Link href="/contact" className="text-blue hover:underline">
                صفحة الاتصال
              </Link>{" "}
              أو عبر{" "}
              <a
                href="https://github.com/dahakabdellah12"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue hover:underline"
              >
                GitHub
              </a>.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
