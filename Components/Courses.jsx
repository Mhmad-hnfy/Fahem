"use client";
import React from "react";
import { BookOpen } from "lucide-react";
import { useGlobalStore } from "@/lib/store";
import Link from "next/link";

export default function Courses() {
  const { categories, classes } = useGlobalStore();

  const getClassesCount = (categoryId) => {
    return classes.filter((c) => c.categoryId === categoryId).length;
  };

  return (
    <section className="py-20 bg-slate-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 px-4">
            المراحل الدراسية الرئيسية
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto px-4">
            ثانوى عام ، اعدادى ، ابتدائى
          </p>
          <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-red-600 mx-auto mt-4 sm:mt-6 rounded-full" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-8 max-w-5xl mx-auto">
          {categories.map((cat, index) => (
            <Link
              href={`/category/${cat.id}`}
              key={cat.id || index}
              className="w-[calc(50%-0.375rem)] sm:w-[320px] group bg-white text-slate-800 rounded-2xl sm:rounded-[32px] p-4 sm:p-8 flex flex-col items-center justify-center text-center shadow-xl border border-red-50 hover:shadow-red-500/20 hover:-translate-y-2 transition-all duration-500"
            >
              <div className="w-12 h-12 sm:w-20 sm:h-20 mb-3 sm:mb-6 bg-red-50 text-red-600 rounded-[14px] sm:rounded-[20px] flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-500">
                <BookOpen className="w-6 h-6 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-base sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-red-600 transition-colors">
                {cat.name}
              </h3>
              <div className="flex gap-2 sm:gap-4 mt-2 sm:mt-4 text-[10px] sm:text-sm font-bold text-slate-500">
                <span>{getClassesCount(cat.id)} صفوف</span>
              </div>
              <span className="mt-4 sm:mt-6 px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl bg-red-50 text-red-600 font-bold group-hover:bg-red-600 group-hover:text-white transition-colors duration-500 text-[10px] sm:text-sm">
                دخول &larr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
