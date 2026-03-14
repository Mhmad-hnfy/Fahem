"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronLeft,
  GraduationCap,
  Calendar,
  School,
  Briefcase,
  Gift,
  PlusCircle,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/lib/store";

const RegistrationPage = () => {
  const router = useRouter();
  const { registerUser, classes, categories } = useGlobalStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    // Mandatory
    name: "",
    phone: "",
    email: "",
    whatsapp: "",
    parentPhone: "",
    parentWhatsapp: "",
    password: "",
    confirmPassword: "",
    categoryId: "", // Added
    classId: "", // Added
    // Optional Student
    discountCode: "",
    schoolName: "",
    religion: "",
    gender: "",
    birthDate: "",
    notes: "",
    // Optional Parent
    fatherJob: "",
    fatherPhone: "",
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
    
    // Ensure numeric values are integers
    const submissionData = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        classId: parseInt(formData.classId)
    };

    const result = await registerUser(submissionData);
    if (result.success) {
        router.push("/");
    } else {
        alert(result.message);
    }
  };

  const inputContainerClass = "relative mb-6 group";
  const iconClass =
    "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors";
  const inputClass =
    "w-full py-4 pr-12 pl-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-right";
  const labelClass = "block text-white text-sm font-medium mb-2 mr-2";
  const sectionTitleClass =
    "text-xl font-bold text-white mb-6 border-r-4 border-red-600 pr-3 mt-8";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 py-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/10 blur-[100px] rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              إنشاء حساب جديد
            </h1>
            <p className="text-gray-400 text-lg">
              بوابة منصة فاهم التعليمية - ابدأ رحلتك الآن
            </p>
          </div>

          <form onSubmit={handleSubmit} dir="rtl">
            {/* --- Section 1: Basic Info (Mandatory) --- */}
            <h2 className={sectionTitleClass}>بيانات الطالب الأساسية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <div className={inputContainerClass}>
                <label className={labelClass}>الاسم الرباعي</label>
                <div className="relative">
                  <User className={iconClass} size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="أدخل اسمك الكامل"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className={inputContainerClass}>
                <label className={labelClass}>
                  الايميل (البريد الإلكتروني)
                </label>
                <div className="relative">
                  <Mail className={iconClass} size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className={inputContainerClass}>
                <label className={labelClass}>رقم الهاتف</label>
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
                <label className={labelClass}>رقم الواتساب</label>
                <div className="relative">
                  <PlusCircle className={iconClass} size={20} />
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="01xxxxxxxxx"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Stage Selection */}
              <div className={inputContainerClass}>
                <label className={labelClass}>المرحلة الدراسية</label>
                <div className="relative">
                  <School className={iconClass} size={20} />
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none pr-12`}
                    required
                  >
                    <option value="" className="bg-slate-900">اختر المرحلة الدراسية</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-slate-900">{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Class Selection */}
              <div className={inputContainerClass}>
                <label className={labelClass}>الصف الدراسي</label>
                <div className="relative">
                  <GraduationCap className={iconClass} size={20} />
                  <select
                    name="classId"
                    value={formData.classId}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none pr-12`}
                    required
                    disabled={!formData.categoryId}
                  >
                    <option value="" className="bg-slate-900">اختر الصف الدراسي</option>
                    {classes
                      .filter(c => c.categoryId === parseInt(formData.categoryId))
                      .map(c => (
                        <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* --- Section 2: Parent Mandatory Info --- */}
            <h2 className={sectionTitleClass}>بيانات التواصل مع ولي الأمر</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <div className={inputContainerClass}>
                <label className={labelClass}>رقم هاتف ولي الأمر</label>
                <div className="relative">
                  <Phone className={iconClass} size={20} />
                  <input
                    type="tel"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleChange}
                    placeholder="01xxxxxxxxx"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className={inputContainerClass}>
                <label className={labelClass}>رقم واتساب ولي الأمر</label>
                <div className="relative">
                  <PlusCircle className={iconClass} size={20} />
                  <input
                    type="tel"
                    name="parentWhatsapp"
                    value={formData.parentWhatsapp}
                    onChange={handleChange}
                    placeholder="01xxxxxxxxx"
                    required
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* --- Section 3: Password --- */}
            <h2 className={sectionTitleClass}>إعداد كلمة المرور</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
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

              <div className={inputContainerClass}>
                <label className={labelClass}>تأكيد كلمة المرور</label>
                <div className="relative">
                  <Lock className={iconClass} size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="********"
                    required
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* --- Section 4: Optional Student Data --- */}
            <h2 className={sectionTitleClass}>بيانات الطالب (اختياري)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <div className={inputContainerClass}>
                <label className={labelClass}>كود الخصم</label>
                <div className="relative">
                  <Gift className={iconClass} size={20} />
                  <input
                    type="text"
                    name="discountCode"
                    value={formData.discountCode}
                    onChange={handleChange}
                    placeholder="إذا كان لديك كود"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className={inputContainerClass}>
                <label className={labelClass}>اسم المدرسة</label>
                <div className="relative">
                  <School className={iconClass} size={20} />
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    placeholder="أدخل اسم مدرستك"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className={inputContainerClass}>
                <label className={labelClass}>الديانة</label>
                <div className="relative">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                    <User size={20} />
                  </div>
                  <select
                    name="religion"
                    value={formData.religion}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none pr-12`}
                  >
                    <option value="" className="bg-slate-900">
                      اختر الديانة
                    </option>
                    <option value="muslim" className="bg-slate-900">
                      مسلم
                    </option>
                    <option value="christian" className="bg-slate-900">
                      مسيحي
                    </option>
                  </select>
                </div>
              </div>

              <div className={inputContainerClass}>
                <label className={labelClass}>النوع (ذكر أم أنثى)</label>
                <div className="relative">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                    <User size={20} />
                  </div>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none pr-12`}
                  >
                    <option value="" className="bg-slate-900">
                      اختر النوع
                    </option>
                    <option value="male" className="bg-slate-900">
                      ذكر
                    </option>
                    <option value="female" className="bg-slate-900">
                      أنثى
                    </option>
                  </select>
                </div>
              </div>

              <div className={inputContainerClass}>
                <label className={labelClass}>تاريخ الميلاد</label>
                <div className="relative">
                  <Calendar className={iconClass} size={20} />
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className={inputContainerClass}>
                <label className={labelClass}>ملاحظات</label>
                <div className="relative">
                  <MessageSquare className={iconClass} size={20} />
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="أي ملاحظات إضافية..."
                    className={`${inputClass} h-[58px] resize-none pt-4`}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* --- Section 5: Optional Parent Data --- */}
            <h2 className={sectionTitleClass}>بيانات الأب (اختياري)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <div className={inputContainerClass}>
                <label className={labelClass}>وظيفة الأب</label>
                <div className="relative">
                  <Briefcase className={iconClass} size={20} />
                  <input
                    type="text"
                    name="fatherJob"
                    value={formData.fatherJob}
                    onChange={handleChange}
                    placeholder="أدخل وظيفة الأب"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className={inputContainerClass}>
                <label className={labelClass}>رقم تليفون الأب الشخصي</label>
                <div className="relative">
                  <Phone className={iconClass} size={20} />
                  <input
                    type="tel"
                    name="fatherPhone"
                    value={formData.fatherPhone}
                    onChange={handleChange}
                    placeholder="01xxxxxxxxx"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#b91c1c" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full mt-10 py-5 bg-red-600 text-white font-bold text-xl rounded-2xl shadow-xl shadow-red-900/40 transition-all"
            >
              إنشاء الحساب مجاناً
            </motion.button>

            <div className="text-center mt-8 text-gray-400">
              <span>لديك حساب بالفعل؟ </span>
              <Link
                href="/login"
                className="text-red-500 hover:text-red-400 font-bold underline-offset-4 hover:underline transition-all"
              >
                تسجيل الدخول
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationPage;
