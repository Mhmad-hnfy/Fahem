"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/lib/store";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Key,
  Video,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { currentUser, isLoaded } = useGlobalStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      if (!currentUser || currentUser.role !== "admin") {
        router.push("/login");
      } else {
        setIsAuthorized(true);
      }
    }
  }, [currentUser, isLoaded, router]);

  if (!isLoaded || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const menuItems = [
    { name: "الرئيسية", icon: LayoutDashboard, href: "/admin" },
    { name: "الفئات الدراسية", icon: BookOpen, href: "/admin/categories" },
    { name: "الصفوف الدراسية", icon: LayoutDashboard, href: "/admin/classes" },
    { name: "المواد الدراسية", icon: BookOpen, href: "/admin/courses" },
    { name: "أبواب وفصول المواد", icon: BookOpen, href: "/admin/chapters" },
    { name: "الدروس", icon: Video, href: "/admin/lessons" },
    { name: "الأكواد", icon: Key, href: "/admin/codes" },
    { name: "الطلاب", icon: Users, href: "/admin/users" },
    { name: "المدرسين", icon: GraduationCap, href: "/admin/teachers" },
    { name: "الإشعارات", icon: Bell, href: "/admin/notifications" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex" dir="rtl">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-slate-900 text-white h-screen fixed right-0 top-0 border-l border-white/10 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-white/10 bg-slate-950">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/40">
            <span className="text-white font-black text-xl leading-none pt-1">
              ف
            </span>
          </div>
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
            لوحة الإدارة
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="mr-auto lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-red-600/10 hover:border hover:border-red-500/30 transition-all group"
              >
                <Icon className="w-5 h-5 group-hover:text-red-500 transition-colors" />
                <span className="font-bold">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link 
            href="/admin/settings"
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="font-bold">الإعدادات</span>
          </Link>
          <Link
            href="/"
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-bold">العودة للموقع</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:mr-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-slate-500 hover:text-red-600 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl lg:text-2xl font-black text-slate-800 hidden sm:block">نظام الإدارة</h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-red-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-r border-slate-200 pt-1 pb-1">
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-slate-800">المدير العام</p>
                <p className="text-xs text-slate-500">admin@fahem.com</p>
              </div>
              <img
                src={currentUser?.image || "https://i.pravatar.cc/150?u=admin"}
                alt="Admin"
                className="w-10 h-10 rounded-xl border-2 border-red-100 object-cover"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1 overflow-x-auto">{children}</div>
      </main>
    </div>
  );
}
