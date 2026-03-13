"use client";

import React, { use } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { useGlobalStore } from "@/lib/store";

export default function CategoryPage({ params }) {
  const unwrappedParams = use(params);
  const categoryId = parseInt(unwrappedParams.categoryId, 10);

  const { categories, classes, courses } = useGlobalStore();

  const category = categories.find((c) => c.id === categoryId);
  const categoryClasses = classes.filter(
    (c) => c.categoryId === categoryId && c.active,
  );

  const getCoursesCount = (classId) => {
    return courses.filter((c) => c.classId === classId && c.active).length;
  };

  if (!category) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-8 text-center"
        dir="rtl"
      >
        <div>
          <h1 className="text-3xl font-black text-slate-800 mb-4">
            انتهت الجلسة أو المرحلة غير موجودة
          </h1>
          <Link href="/" className="text-red-600 font-bold hover:underline">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 lg:pt-32 pb-20" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
          <Link
            href="/"
            className="text-slate-500 hover:text-red-600 transition-colors flex items-center gap-2 font-bold text-sm sm:text-base"
          >
            <ArrowRight className="w-5 h-5 rtl:rotate-180" />
            العودة
          </Link>
          <div className="hidden sm:block w-px h-6 bg-slate-300"></div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900">
            {category.name}
          </h1>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-2xl font-black text-slate-800 mb-4">
            اختر الصف الدراسي
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {categoryClasses.map((cls) => (
            <Link
              href={`/class/${cls.id}`}
              key={cls.id}
              className="group bg-white rounded-[32px] p-8 flex flex-col items-center justify-center text-center shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="w-20 h-20 mb-6 bg-red-50 text-red-600 rounded-[20px] flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-500">
                <BookOpen className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 group-hover:text-red-600 transition-colors">
                {cls.name}
              </h3>
              <div className="mt-4 text-sm font-bold text-slate-500">
                <span>{getCoursesCount(cls.id)} مادة دراسية متاحة</span>
              </div>
              <span className="mt-6 px-6 py-2.5 rounded-xl bg-slate-50 text-slate-600 font-bold group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500 text-sm w-full">
                تصفح المواد
              </span>
            </Link>
          ))}
          {categoryClasses.length === 0 && (
            <p className="col-span-full text-center text-slate-500 font-bold py-10">
              لا توجد صفوف دراسية مفعلة في هذه المرحلة حالياً.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
