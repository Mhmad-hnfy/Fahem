"use client";

import React, { useMemo } from "react";
import { useGlobalStore } from "@/lib/store";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  PlayCircle,
  Video
} from "lucide-react";

export default function AdminDashboard() {
  const { users, teachers, classes, lessonViews, lessons } = useGlobalStore();

  const stats = useMemo(() => {
    const students = users.filter(u => u.role !== "admin");
    const activeTeachers = teachers.filter(t => t.status === "نشط");
    const today = new Date().toDateString();
    const todayViews = (lessonViews || []).filter(v => 
      v.timestamp && new Date(v.timestamp).toDateString() === today
    ).length;

    return [
        {
          title: "إجمالي الطلاب",
          value: students.length.toLocaleString(),
          increase: "+100%", 
          icon: Users,
          color: "text-blue-600",
          bg: "bg-blue-100",
          trend: "text-green-500",
        },
        {
          title: "المدرسين النشطين",
          value: activeTeachers.length.toString(),
          increase: "جديد",
          icon: GraduationCap,
          color: "text-rose-600",
          bg: "bg-rose-100",
          trend: "text-green-500",
        },
        {
          title: "إجمالي الدروس",
          value: lessons.length.toString(),
          increase: "مباشر",
          icon: Video,
          color: "text-amber-600",
          bg: "bg-amber-100",
          trend: "text-amber-500",
        },
        {
          title: "مشاهدات اليوم",
          value: todayViews.toLocaleString(),
          increase: "+100%",
          icon: TrendingUp,
          color: "text-purple-600",
          bg: "bg-purple-100",
          trend: "text-green-500",
        }
    ];
  }, [users, teachers, classes, lessonViews, lessons]);

  const recentActivity = useMemo(() => {
    const registrations = users.filter(u => u.role === "student").map(u => ({
        user: u.name,
        action: "تسجيل جديد بصفتك طالب",
        type: "student",
        timestamp: u.createdAt || u.id,
    }));

    const views = (lessonViews || []).slice(-10).map(v => {
        const user = users.find(u => u.id === v.userId);
        const lesson = lessons.find(l => l.id === v.lessonId);
        return {
            user: user?.name || "طالب مجهول",
            action: `شاهد درس: ${lesson?.name || "درس محذوف"}`,
            type: "view",
            timestamp: v.timestamp,
        };
    });

    const combined = [...registrations, ...views].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return combined.slice(0, 5);
  }, [users, lessonViews, lessons]);

  // Chart Logic (Mocking last 7 days for the curve)
  const chartData = useMemo(() => {
    const days = ["الأحد", "الأثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const today = new Date().getDay();
    const last7Days = [];
    for(let i=6; i>=0; i--) {
        const d = (today - i + 7) % 7;
        last7Days.push(days[d]);
    }

    // Points for SVG (normalized 0-100)
    const points = [10, 25, 45, 30, 60, 85, 95]; 
    return { labels: last7Days, points };
  }, []);

  const formatTime = (ts) => {
    const diff = new Date() - new Date(ts);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "الآن";
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    return new Date(ts).toLocaleDateString("ar-EG");
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">نظرة عامة</h1>
        <p className="text-slate-500 mt-2 font-medium">
          مرحباً بك مجدداً في لوحة التحكم، إليك ملخص أداء المنصة الحقيقي.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span
                  className={`flex items-center gap-1 text-sm font-bold ${stat.trend}`}
                >
                  {stat.increase} <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-slate-500 font-medium text-sm mb-1">
                {stat.title}
              </h3>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h2 className="text-xl font-black text-slate-800">نشاط المنصة</h2>
                 <p className="text-slate-400 text-sm font-bold">آخر 7 أيام من التفاعل</p>
              </div>
              <div className="flex gap-2">
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    المشاهدات
                 </div>
              </div>
           </div>

           <div className="relative h-64 w-full">
              {/* SVG Curve Chart */}
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                 <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                       <stop offset="0%" style={{stopColor:'rgb(239, 68, 68)', stopOpacity:0.2}} />
                       <stop offset="100%" style={{stopColor:'rgb(239, 68, 68)', stopOpacity:0}} />
                    </linearGradient>
                 </defs>
                 
                 {/* Area under curve */}
                 <path 
                    d={`M 0 200 L 0 ${200 - chartData.points[0]*2} C 100 ${200 - chartData.points[1]*2}, 200 ${200 - chartData.points[2]*2}, 300 ${200 - chartData.points[3]*2}, 400 ${200 - chartData.points[4]*2}, 500 ${200 - chartData.points[5]*2}, 600 ${200 - chartData.points[6]*2} L 700 ${200 - chartData.points[6]*2} L 700 200 Z`}
                    fill="url(#grad)"
                 />

                 {/* The Line */}
                 <path 
                    d={`M 0 ${200 - chartData.points[0]*2} C 100 ${200 - chartData.points[1]*2}, 200 ${200 - chartData.points[2]*2}, 300 ${200 - chartData.points[3]*2}, 400 ${200 - chartData.points[4]*2}, 500 ${200 - chartData.points[5]*2}, 600 ${200 - chartData.points[6]*2} L 700 ${200 - chartData.points[6]*2}`}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="animate-chart-draw"
                 />
              </svg>

              {/* Day Labels */}
              <div className="flex justify-between mt-4">
                 {chartData.labels.map(l => (
                    <span key={l} className="text-[10px] font-bold text-slate-400">{l}</span>
                 ))}
              </div>
           </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
          <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-red-500" />
            آخر الجلسات الحية
          </h2>
          <div className="space-y-8">
            {recentActivity.length > 0 ? recentActivity.map((activity, i) => (
              <div key={i} className="relative flex items-start gap-4 pr-4">
                {/* Vertical Line Connector */}
                {i !== recentActivity.length - 1 && (
                    <div className="absolute top-8 bottom-[-20px] right-[11px] w-0.5 bg-slate-100" />
                )}
                
                <div
                  className={`mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full z-10 ${activity.type === "student" ? "bg-red-500 shadow-sm shadow-red-500" : "bg-blue-500 shadow-sm shadow-blue-500"}`}
                ></div>
                <div className="pr-2">
                  <p className="text-sm font-black text-slate-800 leading-tight">
                    {activity.user}
                  </p>
                  <p className="text-[11px] font-bold text-slate-400 mb-1">{activity.action}</p>
                  <div className="flex items-center gap-1 text-[10px] text-red-500 font-black">
                    <Calendar className="w-3 h-3" />
                    <span>{formatTime(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            )) : (
                <div className="text-center py-10">
                    <p className="text-slate-400 font-bold text-sm">لا يوجد نشاط مسجل حالياً</p>
                </div>
            )}
          </div>
          <button className="w-full mt-10 py-4 bg-slate-50 rounded-2xl text-slate-600 font-black hover:bg-slate-100 transition-all text-sm border border-slate-100">
            مراقبة التفاعل المباشر
          </button>
        </div>
      </div>
    </div>
  );
}
