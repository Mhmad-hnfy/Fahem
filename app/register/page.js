"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  PlusCircle,
  CheckCircle2,
  MessageCircleMore,
  ArrowRight,
  School,
  Play
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/lib/store";

const RegistrationPage = () => {
  const router = useRouter();
  const { registerUser, classes, categories } = useGlobalStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredName, setRegisteredName] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    password: "",
    confirmPassword: "",
    categoryId: "",
    classId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("كلمتا المرور غير متطابقتين");
      return;
    }
    
    setLoading(true);
    const result = await registerUser({
        ...formData,
        categoryId: parseInt(formData.categoryId),
        classId: parseInt(formData.classId)
    });
    setLoading(false);

    if (result.success) {
        setRegisteredName(formData.name);
        setShowSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        alert(result.message);
    }
  };

  const inputContainerClass = "relative mb-6 group";
  const iconClass = "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors";
  const inputClass = "w-full py-4 pr-12 pl-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-right";
  const labelClass = "block text-white text-sm font-medium mb-2 mr-2";

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 py-20 relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/20 blur-[120px] rounded-full"></div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl text-center">
            <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/30">
                <CheckCircle2 className="text-red-500 w-12 h-12" />
            </div>
            <h1 className="text-3xl font-black text-white mb-4">أهلاً بك يا {registeredName.split(" ")[0]}!</h1>
            <p className="text-gray-400 text-lg mb-10 font-medium">تم إنشاء حسابك بنجاح. يمكنك الآن الدخول ومشاهدة دروسك.</p>
            <div className="space-y-4">
              <Link href="/login" className="flex items-center justify-center gap-3 w-full py-5 bg-red-600 text-white font-bold text-xl rounded-2xl shadow-xl shadow-red-900/20 transition-all">
                <Play className="w-5 h-5 fill-current" />
                سجل دخولك الآن
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 py-20 relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/10 blur-[100px] rounded-full"></div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mb-2">إنشاء حساب جديد</h1>
            <p className="text-gray-400">انضم لمنصة فاهم وابدأ رحلة التفوق</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-6">
              <div className={inputContainerClass}>
                <label className={labelClass}>الاسم الكامل</label>
                <div className="relative">
                  <User className={iconClass} size={20} />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="أدخل اسمك" required className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <div className={inputContainerClass}>
                    <label className={labelClass}>رقم الهاتف (للدخول)</label>
                    <div className="relative">
                    <Phone className={iconClass} size={20} />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="01xxxxxxxxx" required className={inputClass} />
                    </div>
                </div>
                <div className={inputContainerClass}>
                    <label className={labelClass}>رقم الواتساب</label>
                    <div className="relative">
                    <PlusCircle className={iconClass} size={20} />
                    <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="01xxxxxxxxx" required className={inputClass} />
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <div className={inputContainerClass}>
                    <label className={labelClass}>المرحلة الدراسية</label>
                    <div className="relative">
                    <School className={iconClass} size={20} />
                    <select name="categoryId" value={formData.categoryId} onChange={handleChange} className={`${inputClass} appearance-none pr-12`} required>
                        <option value="" className="bg-slate-900">اختر المرحلة</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id} className="bg-slate-900">{cat.name}</option>
                        ))}
                    </select>
                    </div>
                </div>
                <div className={inputContainerClass}>
                    <label className={labelClass}>الصف الدراسي</label>
                    <div className="relative">
                    <GraduationCap className={iconClass} size={20} />
                    <select name="classId" value={formData.classId} onChange={handleChange} className={`${inputClass} appearance-none pr-12`} required disabled={!formData.categoryId}>
                        <option value="" className="bg-slate-900">اختر الصف</option>
                        {classes.filter(c => c.categoryId === parseInt(formData.categoryId)).map(c => (
                            <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>
                        ))}
                    </select>
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <div className={inputContainerClass}>
                    <label className={labelClass}>كلمة المرور</label>
                    <div className="relative">
                    <Lock className={iconClass} size={20} />
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="********" required className={inputClass} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    </div>
                </div>
                <div className={inputContainerClass}>
                    <label className={labelClass}>تأكيد كلمة المرور</label>
                    <div className="relative">
                    <Lock className={iconClass} size={20} />
                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="********" required className={inputClass} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors">
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    </div>
                </div>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading} className="w-full mt-6 py-5 bg-red-600 text-white font-bold text-xl rounded-2xl shadow-xl shadow-red-900/40 transition-all disabled:opacity-50">
              {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب الآن"}
            </motion.button>

            <div className="text-center mt-8 text-gray-400">
              <span>لديك حساب بالفعل؟ </span>
              <Link href="/login" className="text-red-500 hover:text-red-400 font-bold">تسجيل الدخول</Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationPage;
