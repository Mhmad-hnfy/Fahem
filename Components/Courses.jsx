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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {categories.map((cat, index) => (
            <Link
              href={`/category/${cat.id}`}
              key={cat.id || index}
              className="group bg-white text-slate-800 rounded-[32px] p-8 flex flex-col items-center justify-center text-center shadow-xl border border-red-50 hover:shadow-red-500/20 hover:-translate-y-2 transition-all duration-500"
            >
              <div className="w-20 h-20 mb-6 bg-red-50 text-red-600 rounded-[20px] flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-500">
                <BookOpen className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-red-600 transition-colors">
                {cat.name}
              </h3>
              <div className="flex gap-4 mt-4 text-sm font-bold text-slate-500">
                <span>{getClassesCount(cat.id)} صفوف دراسية</span>
              </div>
              <span className="mt-6 px-6 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold group-hover:bg-red-600 group-hover:text-white transition-colors duration-500 text-sm">
                الدخول للمرحلة &larr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
