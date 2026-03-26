"use client";

import React, { useState } from "react";
import { X, Menu, User, LogOut, LayoutDashboard, Bell, Clock, Trash2 } from "lucide-react";
import Link from "next/link";
import { useGlobalStore } from "@/lib/store";
import { useRouter } from "next/navigation";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logoutUser, notifications, dismissedNotifications, dismissNotification } = useGlobalStore();
  const router = useRouter();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Filter relevant notifications for the current student
  const studentNotifications = notifications.filter(notif => {
    if (!currentUser || currentUser.role === "admin") return false;
    
    // Check if dismissed
    const isDismissed = dismissedNotifications.some(d => d.notificationId === notif.id && d.userId === currentUser.id);
    if (isDismissed) return false;

    if (notif.targetType === "all") return true;
    if (notif.targetType === "category" && notif.categoryId === currentUser.categoryId) return true;
    if (notif.targetType === "class" && notif.classId === currentUser.classId) return true;
    return false;
  });

  const handleLogout = () => {
    logoutUser();
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "المسارات التعليمية", href: "/courses" },
    { name: "المدرسين", href: "/Team" },
    { name: "من نحن", href: "#about" },
    { name: "تواصل معنا", href: "#contact" },
  ];

  return (
    <header className="bg-white sticky top-0 z-[1000] border-b border-red-100 shadow-sm w-full font-bold">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
            <span className="text-white font-black text-2xl leading-none pt-1">
              ف
            </span>
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-500 tracking-tight">
            فاهم
          </h1>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-lg transition-colors ${
                link.href === "/" ? "text-red-600 relative after:absolute after:-bottom-1 after:right-0 after:w-full after:h-0.5 after:bg-red-600 after:rounded-full" : "text-gray-600 hover:text-red-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {currentUser && currentUser.role !== "admin" && (
            <div className="relative">
                <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all relative"
                    title="الإشعارات"
                >
                    <Bell size={24} />
                    {studentNotifications.length > 0 && (
                        <span className="absolute top-2 right-2 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                            {studentNotifications.length}
                        </span>
                    )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                    <div className="absolute left-0 mt-3 w-80 bg-white border border-slate-100 shadow-2xl rounded-3xl z-[1100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200" dir="rtl">
                        <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-black text-slate-800 flex items-center gap-2">
                                <Bell size={18} className="text-red-600" />
                                التنبيهات الجديدة
                            </h3>
                            <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {studentNotifications.length === 0 ? (
                                <div className="p-10 text-center">
                                    <Bell size={40} className="text-slate-100 mx-auto mb-3" />
                                    <p className="text-slate-400 text-sm font-bold">لا توجد تنبيهات حالياً</p>
                                </div>
                            ) : (
                                studentNotifications.map(notif => (
                                    <div key={notif.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="flex-1">
                                                <h4 className="font-black text-slate-900 text-sm mb-1">{notif.title}</h4>
                                                <p className="text-slate-500 text-xs leading-relaxed mb-2 line-clamp-2">{notif.message}</p>
                                                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {new Date(notif.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    dismissNotification(currentUser.id, notif.id);
                                                }}
                                                className="p-1.5 text-slate-300 hover:text-red-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {studentNotifications.length > 0 && (
                            <Link 
                                href="/profile" 
                                onClick={() => setIsNotificationsOpen(false)}
                                className="block w-full py-3 text-center text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                            >
                                عرض كل الإشعارات في حسابي
                            </Link>
                        )}
                    </div>
                )}
            </div>
          )}
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-4">
               {currentUser.role === "admin" && (
                 <Link
                    href="/admin"
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-md"
                 >
                    <LayoutDashboard size={18} />
                    لوحة التحكّم
                 </Link>
               )}
               <Link
                href="/profile"
                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-100"
              >
                <User size={18} />
                حسابي
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="تسجيل الخروج"
              >
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-block px-5 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-red-200"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm sm:text-base"
              >
                حساب جديد
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg lg:hidden transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div 
        className={`lg:hidden fixed inset-0 z-[1100] transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Drawer Content */}
        <div 
          className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white opacity-100 shadow-2xl transition-transform duration-300 transform border-l border-slate-100 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ backgroundColor: '#ffffff', opacity: 1 }}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xl leading-none pt-1">ف</span>
                </div>
                <span className="text-2xl font-black text-red-700">فاهم</span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-4 rounded-xl text-lg transition-all ${
                    link.href === "/" ? "bg-red-50 text-red-600" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {currentUser?.role === "admin" && (
                 <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-4 rounded-xl text-lg text-slate-900 hover:bg-slate-50 flex items-center gap-2"
                 >
                    <LayoutDashboard size={20} className="text-red-600" />
                    لوحة التحكّم
                 </Link>
              )}
            </nav>

            <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
              {currentUser ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-4 flex items-center justify-center gap-2 bg-red-50 text-red-600 rounded-2xl font-black"
                  >
                    <User size={20} />
                    حسابي الشخصي
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-4 flex items-center justify-center gap-2 bg-slate-50 text-slate-600 rounded-2xl"
                  >
                    <LogOut size={20} />
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-4 text-center text-red-600 rounded-xl transition-all border border-red-200"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-4 text-center bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl shadow-lg"
                  >
                    إنشاء حساب جديد
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
