"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SocialLinksFull } from "@/components/social-links";

export function LegalContent() {
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
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-cyan"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            الرجوع
          </Link>

          <p className="mb-2 text-xs font-bold tracking-[0.2em] text-cyan uppercase">
            // الشروط والأحكام
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            الشروط والأحكام
          </h1>
          <p className="mt-2 font-mono text-sm text-muted-foreground">
            آخر تحديث: 15 يوليو 2026
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 space-y-6 text-muted-foreground leading-relaxed"
        >
          <section className="glass-card relative rounded border p-6">
            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/30" />
            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/30" />
            <h2 className="mb-3 text-xs font-bold tracking-[0.15em] text-cyan/70 uppercase">
              // الموافقة على الشروط
            </h2>
            <p>
              بدخولك إلى موقع <strong className="text-foreground">DAHAK Studio</strong> (
              <a href="https://dahak-studio.vercel.app" className="text-cyan transition-colors hover:text-cyan/80 hover:underline" target="_blank" rel="noopener noreferrer">
                dahak-studio.vercel.app
              </a>
              )، فإنك توافق تلقائياً على جميع الشروط والأحكام والسياسات المذكورة في هذه الصفحة. إذا لم توافق على أي من هذه الشروط، يُرجى عدم استخدام الموقع.
            </p>
          </section>

          <section className="glass-card relative rounded border p-6">
            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/30" />
            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/30" />
            <h2 className="mb-3 text-xs font-bold tracking-[0.15em] text-cyan/70 uppercase">
              // الاستخدام
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>هذا الموقع شخصي ويعرض مشاريع وأعمال Developper واحد.</li>
              <li>المحتوى المعروض (نصوص، صور، أكواد) هو ملكية فكرية لصاحب الموقع ما لم يُذكر خلاف ذلك.</li>
              <li>يُسمح بالاطلاع على المشاريع المفتوحة المصدر وفقاً للترخيص الخاص بكل مشروع.</li>
            </ul>
          </section>

          <section className="glass-card relative rounded border p-6">
            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/30" />
            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/30" />
            <h2 className="mb-3 text-xs font-bold tracking-[0.15em] text-cyan/70 uppercase">
              // المشاريع مفتوحة المصدر
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>المشاريع المنشورة على GitHub بمفتوحة المصدر تُخضع للتراخيص المحددة في مستودعاتها.</li>
              <li>يمكنك استخدام وتعديل ونشر المشاريع مفتوحة المصدر وفقاً للترخيص المذكور (مثل MIT أو GPL).</li>
              <li>يُطلب ذكر المصدر عند استخدام أو إعادة توزيع أي مشروع مفتوح المصدر.</li>
            </ul>
          </section>

          <section className="glass-card relative rounded border p-6">
            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/30" />
            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/30" />
            <h2 className="mb-3 text-xs font-bold tracking-[0.15em] text-cyan/70 uppercase">
              // الخصوصية
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>الموقع لا يجمع أي بيانات شخصية من الزوار.</li>
              <li>لا توجد ملفات تعريف ارتباط (Cookies) تُستخدم لتتبع الزوار.</li>
              <li>ملفات تعريف ارتباط الداشبورد تُستخدم فقط للمصادقة ولا تُشارك مع أطراف ثالثة.</li>
              <li>قد تُجمع بعض البيانات التقنية بشكل مجهول عبر خدمات الاستضافة.</li>
            </ul>
          </section>

          <section className="glass-card relative rounded border p-6">
            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/30" />
            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/30" />
            <h2 className="mb-3 text-xs font-bold tracking-[0.15em] text-cyan/70 uppercase">
              // المسؤولية
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>الموقع يُقدم &ldquo;كما هو&rdquo; دون أي ضمانات صريحة أو ضمنية.</li>
              <li>صاحب الموقع غير مسؤول عن أي أضرار ناتجة عن استخدام الموقع أو محتواه.</li>
              <li>روابط المواقع الخارجية ليست تحت السيطرة ولا نتحمل مسؤولية محتواها.</li>
            </ul>
          </section>

          <section className="glass-card relative rounded border p-6">
            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/30" />
            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/30" />
            <h2 className="mb-3 text-xs font-bold tracking-[0.15em] text-cyan/70 uppercase">
              // التعديلات
            </h2>
            <p>
              يحتفظ صاحب الموقع بحق تعديل هذه الشروط والأحكام في أي وقت دون إشعار مسبق. التعديلات تدخل حيز التنفيذ فور نشرها على هذه الصفحة. استمرارك في استخدام الموقع بعد التعديلات يُعتبر موافقة على الشروط المعدّلة.
            </p>
          </section>

          <section className="glass-card relative rounded border p-6">
            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan/30" />
            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan/30" />
            <h2 className="mb-3 text-xs font-bold tracking-[0.15em] text-cyan/70 uppercase">
              // التواصل
            </h2>
            <p className="mb-4">
              لأي استفسارات حول هذه الشروط، يمكنك التواصل عبر المنصات التالية:
            </p>
            <ul className="space-y-2">
              <SocialLinksFull />
            </ul>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
