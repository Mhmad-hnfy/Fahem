"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Layers,
  ChevronLeft,
  BookMarked,
  Home,
  MessageCircle,
} from "lucide-react";

const menuGroups = [
  {
    label: "عام",
    items: [
      { name: "الرئيسية", icon: LayoutDashboard, href: "/admin" },
    ],
  },
  {
    label: "المحتوى التعليمي",
    items: [
      { name: "الفئات الدراسية", icon: Layers, href: "/admin/categories" },
      { name: "الصفوف الدراسية", icon: BookMarked, href: "/admin/classes" },
      { name: "المواد الدراسية", icon: BookOpen, href: "/admin/courses" },
      { name: "الأبواب والفصول", icon: ChevronLeft, href: "/admin/chapters" },
      { name: "الدروس", icon: Video, href: "/admin/lessons" },
    ],
  },
  {
    label: "المستخدمون",
    items: [
      { name: "الطلاب", icon: Users, href: "/admin/users" },
      { name: "المدرسين", icon: GraduationCap, href: "/admin/teachers" },
      { name: "الأكواد", icon: Key, href: "/admin/codes" },
    ],
  },
  {
    label: "الإدارة",
    items: [
      { name: "رسائل واتساب", icon: MessageCircle, href: "/admin/whatsapp" },
      { name: "الإشعارات", icon: Bell, href: "/admin/notifications" },
      { name: "الإعدادات", icon: Settings, href: "/admin/settings" },
    ],
  },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (!isLoaded || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isActive = (href) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex" dir="rtl">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-slate-900 text-white h-screen fixed right-0 top-0 border-l border-white/10 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-white/10 bg-slate-950 shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/40">
            <span className="text-white font-black text-xl leading-none pt-1">ف</span>
          </div>
          <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
            لوحة الإدارة
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="mr-auto lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 mb-2">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-all group ${
                        active
                          ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          active ? "text-white" : "text-slate-500 group-hover:text-red-400"
                        }`}
                      />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-1 shrink-0">
          <Link
            href="/"
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all font-bold text-sm"
          >
            <Home className="w-4 h-4" />
            <span>العودة للموقع</span>
          </Link>
          <button
            onClick={() => router.push("/login")}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-all font-bold text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:mr-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-slate-500 hover:text-red-600 transition-colors p-1"
            >
              <Menu className="w-6 h-6" />
            </button>
            {/* Current page breadcrumb */}
            <span className="text-sm font-bold text-slate-500 hidden sm:block">
              {menuGroups
                .flatMap((g) => g.items)
                .find((i) => isActive(i.href))?.name ?? "الإدارة"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/admin/notifications" className="relative text-slate-400 hover:text-red-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </Link>
            <div className="flex items-center gap-2.5 pl-4 border-r border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-800">{currentUser?.name || "المدير العام"}</p>
                <p className="text-[10px] text-slate-400">{currentUser?.email || "admin@fahem.com"}</p>
              </div>
              <img
                src={currentUser?.image || "https://i.pravatar.cc/150?u=admin"}
                alt="Admin"
                className="w-9 h-9 rounded-xl border-2 border-red-100 object-cover"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8 flex-1 overflow-x-auto">{children}</div>
      </main>
    </div>
  );
}
