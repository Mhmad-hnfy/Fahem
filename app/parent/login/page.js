"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/lib/store";
import { Phone, ArrowRight, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";

export default function ParentLogin() {
  const router = useRouter();
  const { loginParent } = useGlobalStore();
  const [parentPhone, setParentPhone] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await loginParent(parentPhone, studentPhone);
    if (res.success) {
      router.push("/parent/dashboard");
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4" dir="rtl">
      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 bg-slate-50">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-red-600 to-rose-600 text-white shadow-xl shadow-red-200 mb-6 rotate-3">
             <Users className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-3">لوحة ولي الأمر</h1>
          <p className="text-slate-500 font-bold">تابع مستوى ابنك الأكاديمي لحظة بلحظة</p>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl p-8 border border-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            {error && (
              <div className="p-4 bg-red-50 border-r-4 border-red-500 text-red-700 text-sm font-bold rounded-xl animate-in fade-in slide-in-from-top-1 duration-300">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 pr-2 block">رقم هاتف ولي الأمر</label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="رقم الموبايل المسجل في حساب الطالب"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pr-12 pl-4 text-sm font-bold focus:outline-none focus:border-red-500 focus:bg-white transition-all outline-none"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 pr-2 block">رقم هاتف الطالب</label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="رقم موبايل الابن للتحقق"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pr-12 pl-4 text-sm font-bold focus:outline-none focus:border-red-500 focus:bg-white transition-all outline-none"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                />
              </div>
              <p className="text-[10px] text-slate-400 pr-2 font-medium">للتحقق من الحساب، يرجى إدخال رقم هاتف الطالب المسجل.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl py-4 font-black shadow-lg shadow-red-200 hover:shadow-red-300 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? "جاري التحقق..." : "دخول للوحة المتابعة"}
              {!loading && <ArrowRight className="w-5 h-5 scale-x-[-1]" />}
            </button>
          </form>
        </div>

        <div className="text-center mt-8 space-y-4">
          <Link href="/login" className="text-slate-500 hover:text-red-600 font-bold text-sm transition-colors flex items-center justify-center gap-2">
            دخول كطالب بدلاً من ذلك
          </Link>
        </div>
      </div>
    </div>
  );
}
