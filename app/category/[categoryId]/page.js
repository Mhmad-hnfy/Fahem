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
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 max-w-5xl mx-auto">
          {categoryClasses.map((cls) => (
            <Link
              href={`/class/${cls.id}`}
              key={cls.id}
              className="w-full sm:w-[380px] group bg-white text-slate-800 rounded-2xl sm:rounded-[24px] flex flex-col overflow-hidden shadow-xl border border-red-50 hover:shadow-red-500/20 hover:-translate-y-2 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-[190px] sm:h-[240px] overflow-hidden bg-red-50">
                {cls.image ? (
                  <img
                    src={cls.image}
                    alt={cls.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100">
                    <BookOpen className="w-16 h-16 text-red-300" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="px-5 py-4 sm:px-7 sm:py-5 flex flex-col gap-2 bg-white relative">
                <div className="absolute top-0 right-0 left-0 h-[3px] bg-gradient-to-r from-red-500 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-base sm:text-xl font-black tracking-tight text-slate-900 group-hover:text-red-600 transition-colors text-right">
                  {cls.name}
                </h3>
                <div className="w-full h-px bg-red-50 my-1" />
                <p className="text-xs sm:text-sm text-slate-500 font-medium text-right">
                  {getCoursesCount(cls.id)} مادة دراسية
                </p>
              </div>
            </Link>
          ))}
          {categoryClasses.length === 0 && (
            <p className="w-full text-center text-slate-500 font-bold py-10">
              لا توجد صفوف دراسية مفعلة في هذه المرحلة حالياً.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
