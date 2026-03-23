"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Phone, Lock, Eye, EyeOff, LogIn, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/lib/store";

const LoginPage = () => {
  const router = useRouter();
  const { loginUser } = useGlobalStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const result = loginUser(formData.phone, formData.password);
    if (result.success) {
      // Check if user is admin
      if (result.user?.role === "admin") {
         router.push("/admin");
      } else {
         router.push("/");
      }
    } else {
      setError(result.message);
    }
  };

  const inputContainerClass = "relative mb-6 group";
  const iconClass =
    "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors";
  const inputClass =
    "w-full py-5 pr-12 pl-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-right";
  const labelClass = "block text-white text-sm font-medium mb-2 mr-2";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/10 blur-[100px] rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-900/40 rotate-3">
              <LogIn className="text-white" size={40} />
            </div>
            <h1 className="text-4xl font-black text-white mb-2">
              تسجيل الدخول
            </h1>
            <p className="text-gray-400">أهلاً بك مجدداً في منصة فاهم</p>
          </div>

          <form onSubmit={handleSubmit} dir="rtl">
             <div className="text-center font-bold text-red-500 text-xs mb-4">{error}</div>
             <div className={inputContainerClass}>
               <label className={labelClass}>رقم هاتف الطالب</label>
              <div className="relative">
                <Phone className={iconClass} size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01xxxxxxxxx"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className={inputContainerClass}>
              <label className={labelClass}>كلمة المرور</label>
              <div className="relative">
                <Lock className={iconClass} size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  required
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-start mb-8 mr-2">
              <Link
                href="#"
                className="text-sm text-gray-400 hover:text-red-500 transition-all"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#b91c1c" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-5 bg-red-600 text-white font-bold text-xl rounded-2xl shadow-xl shadow-red-900/40 transition-all flex items-center justify-center gap-3"
            >
              دخول
              <LogIn size={20} />
            </motion.button>

            <div className="text-center mt-10 p-6 bg-white/5 rounded-3xl border border-white/5">
              <span className="text-gray-400 block mb-3">ليس لديك حساب؟</span>
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 text-white font-bold hover:text-red-500 transition-all text-lg group"
              >
                <UserPlus
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                إنشاء حساب طالب جديد
              </Link>
              <div className="h-px bg-white/10 my-4"></div>
              <Link
                href="/parent/login"
                className="flex items-center justify-center gap-2 text-red-400 font-bold hover:text-red-300 transition-all text-sm group"
              >
                <Users size={16} />
                دخول ولي الأمر لمتابعة مستوى الطالب
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
