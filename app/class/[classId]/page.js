"use client";

import React, { use } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, Video, GraduationCap } from "lucide-react";
import { useGlobalStore } from "@/lib/store";

export default function ClassPage({ params }) {
  const unwrappedParams = use(params);
  const classId = parseInt(unwrappedParams.classId, 10);

  const { classes, courses, teachers, categories } = useGlobalStore();

  const classObj = classes.find((c) => c.id === classId);
  const classCourses = courses.filter((c) => c.classId === classId && c.active);

  if (!classObj) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-8 text-center"
        dir="rtl"
      >
        <div>
          <h1 className="text-3xl font-black text-slate-800 mb-4">
            الصف الدراسي غير موجود
          </h1>
          <Link href="/" className="text-red-600 font-bold hover:underline">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const category = categories.find((c) => c.id === classObj.categoryId);
  const getTeacher = (teacherId) => teachers.find((t) => t.id === teacherId);

  return (
    <main className="min-h-screen bg-slate-50 pt-24 lg:pt-32 pb-20" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-3 mb-12 text-sm md:text-base">
          <Link
            href="/"
            className="text-slate-500 hover:text-red-600 font-bold transition-colors"
          >
            الرئيسية
          </Link>
          <ArrowRight className="w-4 h-4 text-slate-400 rotate-180" />
          {category && (
            <>
              <Link
                href={`/category/${category.id}`}
                className="text-slate-500 hover:text-red-600 font-bold transition-colors"
              >
                {category.name}
              </Link>
              <ArrowRight className="w-4 h-4 text-slate-400 rotate-180" />
            </>
          )}
          <span className="text-slate-900 font-black truncate max-w-[200px] sm:max-w-none">
            {classObj.name}
          </span>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
            المواد الدراسية (الكورسات)
          </h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto mb-6">
            تصفح جميع المواد المتاحة لهذا الصف مع نخبة من أفضل المدرسين.
          </p>
          <div className="w-16 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {classCourses.map((course) => {
            const teacher = getTeacher(course.teacherId);

            return (
              <div
                key={course.id}
                className="group bg-white rounded-[32px] p-8 flex flex-col items-center justify-center text-center shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500"></div>

                <div className="w-20 h-20 mb-6 bg-red-100 text-red-600 rounded-[20px] flex items-center justify-center z-10 overflow-hidden relative shadow-sm">
                  {course.image ? (
                    <img src={course.image} alt={course.name} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-10 h-10" />
                  )}
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-2 z-10 relative">
                  {course.name}
                </h3>

                {teacher && (
                  <Link
                    href={`/teachers/${teacher.id}`}
                    className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full transition-all z-10"
                  >
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span>{teacher.name}</span>
                  </Link>
                )}

                <Link
                  href={`/course/${course.id}`}
                  className="mt-6 sm:mt-8 px-8 py-3 w-full rounded-2xl bg-red-600 text-white font-bold shadow-md hover:bg-red-700 shadow-red-200 transition-all duration-300 text-sm flex items-center justify-center gap-2 z-10"
                >
                  <Video className="w-4 h-4" />
                  تفاصيل الكورس
                </Link>
              </div>
            );
          })}

          {classCourses.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <BookOpen className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">
                لا توجد مواد متاحة
              </h3>
              <p className="text-slate-500 font-medium">
                لم يتم إضافة أي مواد دراسية لهذا الصف حتى الآن.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
