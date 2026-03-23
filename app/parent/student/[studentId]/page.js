"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGlobalStore } from "@/lib/store";
import { 
  ArrowRight, 
  BookOpen, 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  Lock,
  BarChart3,
  Calendar,
  Layout
} from "lucide-react";
import Link from "next/link";

export default function StudentDetail() {
  const router = useRouter();
  const params = useParams();
  const studentId = parseInt(params.studentId, 10);
  
  const { 
    currentParent, 
    users, 
    lessons, 
    chapters, 
    courses, 
    unlockedChapters, 
    viewCounts, 
    isLoaded 
  } = useGlobalStore();

  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (isLoaded && (!currentParent || !studentId)) {
      router.push("/parent/login");
    }
  }, [isLoaded, currentParent, studentId, router]);

  useEffect(() => {
    if (isLoaded && users.length > 0) {
      const found = users.find(u => u.id === studentId && u.parentPhone === currentParent?.parentPhone);
      if (!found) {
        router.push("/parent/dashboard");
      } else {
        setStudent(found);
      }
    }
  }, [isLoaded, users, studentId, currentParent, router]);

  if (!isLoaded || !student) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const studentCourses = courses.filter(c => c.classId === student.classId);
  const studentUnlocked = (unlockedChapters || []).filter(u => u.userId === student.id);
  const studentViews = (viewCounts || []).filter(v => v.userId === student.id && v.count > 0);

  const calculateCourseProgress = (courseId) => {
    const courseChapters = chapters.filter(ch => ch.courseId === courseId);
    const chapterIds = courseChapters.map(ch => ch.id);
    const courseLessons = lessons.filter(l => chapterIds.includes(parseInt(l.chapterId)));
    
    if (courseLessons.length === 0) return 0;
    
    const watchedInCourse = studentViews.filter(v => courseLessons.some(l => l.id === v.lessonId)).length;
    return Math.round((watchedInCourse / courseLessons.length) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12 mb-20" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs / Back */}
        <Link 
          href="/parent/dashboard" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold mb-8 transition-colors"
        >
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          العودة للوحة الأبناء
        </Link>

        {/* Student Profile Header */}
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -mr-32 -mt-32 opacity-30"></div>
          
          <img 
            src={student.image || "https://i.pravatar.cc/150?u="+student.id} 
            alt={student.name} 
            className="w-32 h-32 md:w-48 md:h-48 rounded-[40px] object-cover border-8 border-slate-50 shadow-lg relative z-10"
          />
          
          <div className="text-center md:text-right relative z-10">
             <div className="inline-block px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-xs font-black mb-3">ملف الطالب</div>
             <h1 className="text-4xl font-black text-slate-900 mb-2">{student.name}</h1>
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm bg-slate-50 px-4 py-2 rounded-xl">
                   <Layout className="w-4 h-4 text-red-600" />
                   {student.schoolName || "مدرسة غير محددة"}
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm bg-slate-50 px-4 py-2 rounded-xl">
                   <Calendar className="w-4 h-4 text-red-600" />
                   سجل في: {new Date(student.createdAt || student.created_at).toLocaleDateString('ar-EG')}
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Detailed Progress List */}
           <div className="lg:col-span-2 space-y-8">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                 <BarChart3 className="w-6 h-6 text-red-600" />
                 تفاصيل التقدم في المواد
              </h2>
              
              <div className="space-y-6">
                 {studentCourses.map(course => {
                    const progress = calculateCourseProgress(course.id);
                    const courseChaptersList = chapters.filter(ch => ch.courseId === course.id);
                    
                    return (
                       <div key={course.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 transition-all hover:shadow-md">
                          <div className="flex justify-between items-center mb-6">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-black">
                                   {course.name.charAt(0)}
                                </div>
                                <div>
                                   <h3 className="text-xl font-black text-slate-800">{course.name}</h3>
                                   <p className="text-xs text-slate-400 font-bold mt-0.5">{courseChaptersList.length} أبواب دراسية</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <span className="text-2xl font-black text-red-600">{progress}%</span>
                                <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">اكتمال المادة</p>
                             </div>
                          </div>

                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-6 shadow-inner">
                             <div 
                               className="h-full bg-gradient-to-r from-red-600 to-rose-600 rounded-full transition-all duration-1000"
                               style={{ width: `${progress}%` }}
                             ></div>
                          </div>

                          <div className="space-y-3 pt-4 border-t border-slate-50">
                             <p className="text-xs font-black text-slate-500 mb-2">الأبواب التي تم فتحها للأبناء:</p>
                             <div className="flex flex-wrap gap-2">
                                {courseChaptersList.map(ch => {
                                   const isUnlocked = studentUnlocked.some(u => u.chapterId === ch.id) || Number(ch.price || 0) === 0;
                                   return (
                                      <div 
                                        key={ch.id} 
                                        className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                                          isUnlocked 
                                            ? 'bg-green-50 border-green-100 text-green-700' 
                                            : 'bg-slate-50 border-slate-100 text-slate-400'
                                        }`}
                                      >
                                         {isUnlocked ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4 opacity-40" />}
                                         {ch.name}
                                      </div>
                                   );
                                })}
                             </div>
                          </div>
                       </div>
                    );
                 })}
                 {studentCourses.length === 0 && (
                    <div className="bg-white p-12 rounded-[32px] text-center border-2 border-dashed border-slate-100 text-slate-400 font-bold">
                       لا يوجد مواد دراسية مسجلة لهذا العام الدراسي حالياً.
                    </div>
                 )}
              </div>
           </div>

           {/* Sidebar Info */}
           <div className="space-y-8">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                 <Clock className="w-6 h-6 text-red-600" />
                 نشاط المشاهدة
              </h2>

              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                 <div className="space-y-6">
                    {studentViews.length > 0 ? (
                       studentViews.slice(0, 5).reverse().map((view, idx) => {
                          const lesson = lessons.find(l => l.id === view.lessonId);
                          return (
                             <div key={idx} className="flex gap-4 relative">
                                {idx < 4 && <div className="absolute top-10 bottom-0 right-[23px] w-0.5 bg-slate-100"></div>}
                                <div className="z-10 bg-white p-1">
                                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${view.count >= 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                      <PlayCircle className="w-6 h-6" />
                                   </div>
                                </div>
                                <div className="pt-1">
                                   <h4 className="text-sm font-black text-slate-800 leading-tight">{lesson?.name || "درس غير معروف"}</h4>
                                   <p className="text-xs text-slate-400 font-bold mt-1">مرات المشاهدة: {view.count} مرات</p>
                                </div>
                             </div>
                          );
                       })
                    ) : (
                       <p className="text-slate-400 text-sm font-bold text-center py-6">لم يقم الطالب بمشاهدة أي دروس بعد.</p>
                    )}
                 </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[32px] p-8 text-white shadow-xl">
                 <h3 className="text-lg font-black mb-4">الدعم الفني لأولياء الأمور</h3>
                 <p className="text-sm text-slate-400 font-bold leading-loose mb-6">إذا واجهتك أي مشكلة في متابعة مستوى ابنك أو كان لديك استفسار، تواصل معنا فوراً.</p>
                 <button className="w-full py-3 bg-red-600 rounded-2xl font-black text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-900/50">
                    تواصل معنا واتساب
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
