"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/lib/store";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  ArrowLeft, 
  LogOut, 
  User as UserIcon,
  ChevronLeft,
  Calendar
} from "lucide-react";
import Link from "next/link";

export default function ParentDashboard() {
  const router = useRouter();
  const { 
    currentParent, 
    users, 
    lessons, 
    viewCounts, 
    logoutParent, 
    isLoaded 
  } = useGlobalStore();

  const [myStudents, setMyStudents] = useState([]);

  useEffect(() => {
    if (isLoaded && !currentParent) {
      router.push("/parent/login");
    }
  }, [isLoaded, currentParent, router]);

  useEffect(() => {
    if (currentParent && users.length > 0) {
      const related = users.filter(u => u.parentPhone === currentParent.parentPhone);
      setMyStudents(related);
    }
  }, [currentParent, users]);

  const calculateProgress = (studentId, classId) => {
    const studentViews = (viewCounts || []).filter(v => v.userId === studentId && v.count > 0);
    const classLessons = lessons.filter(l => l.classId === classId);
    
    if (classLessons.length === 0) return 0;
    
    // Unique lessons watched
    const watchedCount = studentViews.length;
    return Math.round((watchedCount / classLessons.length) * 100);
  };

  if (!isLoaded || !currentParent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12" dir="rtl">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">مرحباً بك، ولي الأمر</h1>
          <p className="text-slate-500 font-bold flex items-center gap-2">
             <Calendar className="w-4 h-4" />
             تاريخ اليوم: {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button 
          onClick={() => {
            logoutParent();
            router.push("/parent/login");
          }}
          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 hover:text-red-600 rounded-2xl font-bold shadow-sm border border-slate-100 transition-all"
        >
          <LogOut className="w-5 h-5" />
          تسجيل الخروج
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center gap-4">
             <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7" />
             </div>
             <div>
                <p className="text-slate-400 text-sm font-bold">عدد الأبناء</p>
                <p className="text-2xl font-black text-slate-900">{myStudents.length}</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center gap-4">
             <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7" />
             </div>
             <div>
                <p className="text-slate-400 text-sm font-bold">متوسط الإنجاز</p>
                <p className="text-2xl font-black text-slate-900">
                   {myStudents.length > 0 
                     ? Math.round(myStudents.reduce((acc, s) => acc + calculateProgress(s.id, s.classId), 0) / myStudents.length)
                     : 0}%
                </p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center gap-4">
             <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-7 h-7" />
             </div>
             <div>
                <p className="text-slate-400 text-sm font-bold">إجمالي الدروس المشاهدة</p>
                <p className="text-2xl font-black text-slate-900">
                   {viewCounts.filter(v => myStudents.some(s => s.id === v.userId) && v.count > 0).length} درس
                </p>
             </div>
          </div>
        </div>

        {/* Students List */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
             <UserIcon className="w-6 h-6 text-red-600" />
             قائمة الأبناء المسجلين
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {myStudents.map(student => {
              const progress = calculateProgress(student.id, student.classId);
              return (
                <Link 
                  href={`/parent/student/${student.id}`}
                  key={student.id}
                  className="group bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-24 h-24 bg-red-50 rounded-full -ml-12 -mt-12 transition-transform group-hover:scale-110"></div>
                  
                  <div className="flex items-center gap-6 relative">
                    <img 
                      src={student.image || "https://i.pravatar.cc/150?u="+student.id} 
                      alt={student.name} 
                      className="w-20 h-20 rounded-3xl object-cover border-4 border-slate-50"
                    />
                    <div>
                      <h3 className="text-xl font-black text-slate-800 mb-1">{student.name}</h3>
                      <p className="text-slate-400 font-bold text-sm">طالب - {student.schoolName || "مدرسة غير محددة"}</p>
                    </div>
                    <div className="mr-auto w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                       <ChevronLeft className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="mt-8 space-y-4 relative">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-sm font-black text-slate-600">نسبة التقدم الأكاديمي</span>
                       <span className="text-sm font-black text-red-600">{progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                       <div 
                         className="h-full bg-gradient-to-r from-red-600 to-rose-600 rounded-full transition-all duration-1000"
                         style={{ width: `${progress}%` }}
                       ></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                       <span>بداية المنهج</span>
                       <span>اكتمال المنهج</span>
                    </div>
                  </div>
                </Link>
              );
            })}
            {myStudents.length === 0 && (
               <div className="col-span-full bg-white p-20 rounded-[40px] text-center shadow-inner border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-bold text-xl">لم يتم العثور على أبناء مسجلين بهذا الرقم.</p>
                  <p className="text-slate-300 mt-2">يرجى التأكد من أن الطالب قام بإضافة رقم هاتفك في بياناته.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
