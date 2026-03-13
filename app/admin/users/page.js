"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Shield,
  User,
  GraduationCap,
  Trash2,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  CheckSquare,
  Square,
  BookOpen
} from "lucide-react";
import { useGlobalStore } from "@/lib/store";

export default function UsersManagement() {
  const { users, classes, unlockedChapters, lessons, lessonViews, categories, deleteUser, updateUser } = useGlobalStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showActions, setShowActions] = useState(null);
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [categoryFilter, setCategoryFilter] = useState("الكل");

  const calculateProgress = (userId) => {
    const myUnlockedIds = (unlockedChapters || [])
      .filter(u => u.userId === userId)
      .map(u => u.chapterId);
    
    if (myUnlockedIds.length === 0) return 0;

    const unlockedLessons = (lessons || []).filter(l => myUnlockedIds.includes(l.chapterId));
    if (unlockedLessons.length === 0) return 0;

    const watchedIds = new Set((lessonViews || [])
      .filter(v => v.userId === userId)
      .map(v => v.lessonId));
    
    const watchedCount = unlockedLessons.filter(l => watchedIds.has(l.id)).length;
    return Math.round((watchedCount / unlockedLessons.length) * 100);
  };

  const filteredUsers = users.filter(user => {
    const searchLow = searchTerm.toLowerCase();
    const matchesSearch = user.role !== "admin" && 
        ((user.name || "").toLowerCase().includes(searchLow) ||
        (user.phone || "").includes(searchTerm) ||
        ((user.email || "").toLowerCase().includes(searchLow)));
    
    const matchesStatus = statusFilter === "الكل" || user.status === statusFilter;
    const matchesCategory = categoryFilter === "الكل" || user.categoryId?.toString() === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const toggleSelectUser = (id) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedUsers(newSelected);
  };

  const handleBulkDelete = () => {
    if (confirm(`هل أنت متأكد من حذف ${selectedUsers.size} طالب؟`)) {
      selectedUsers.forEach(id => deleteUser(id));
      setSelectedUsers(new Set());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">إدارة الطلاب</h1>
          <p className="text-slate-500 mt-2 font-medium">
            عرض وإدارة حسابات جميع الطلاب المسجلين بالمنصة.
          </p>
        </div>
        <div className="flex items-center gap-4 text-slate-400 font-bold bg-white px-6 py-2.5 rounded-xl border border-slate-100">
            <span>إجمالي الطلاب:</span>
            <span className="text-red-600">{users.filter(u => u.role !== "admin").length}</span>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث بالاسم، رقم الهاتف، أو الإيميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pr-12 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all font-bold"
              />
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm font-bold focus:outline-none"
              >
                <option value="الكل">جميع الحالات</option>
                <option value="نشط">نشط</option>
                <option value="غير نشط">غير نشط</option>
              </select>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm font-bold focus:outline-none"
              >
                <option value="الكل">جميع المراحل</option>
                {(categories || []).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedUsers.size > 0 && (
            <div className="flex items-center justify-between bg-red-50 p-4 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3 text-red-600 font-bold">
                <CheckSquare className="w-5 h-5" />
                <span>تم تحديد {selectedUsers.size} طالب</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-md shadow-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف المحدد
                </button>
                <button 
                  onClick={() => setSelectedUsers(new Set())}
                  className="px-4 py-2 bg-white text-slate-500 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 w-12 text-center">
                  <button onClick={toggleSelectAll} className="p-1 rounded-md hover:bg-slate-200 transition-colors">
                    {selectedUsers.size === filteredUsers.length && filteredUsers.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-red-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300" />
                    )}
                  </button>
                </th>
                <th className="p-4 font-bold text-slate-600 text-sm whitespace-nowrap">اسم الطالب</th>
                <th className="p-4 font-bold text-slate-600 text-sm whitespace-nowrap">رقم الهاتف</th>
                <th className="p-4 font-bold text-slate-600 text-sm whitespace-nowrap">المرحلة</th>
                <th className="p-4 font-bold text-slate-600 text-sm whitespace-nowrap">الصف</th>
                <th className="p-4 font-bold text-slate-600 text-sm whitespace-nowrap">الحالة</th>
                <th className="p-4 font-bold text-slate-600 text-sm whitespace-nowrap">الإنجاز</th>
                <th className="p-4 font-bold text-slate-600 text-sm whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map((user, i) => {
                const userClass = classes.find(c => c.id === parseInt(user.classId));
                const userCat = categories.find(c => c.id === parseInt(user.categoryId));
                return (
                  <tr
                    key={user.id}
                    className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${selectedUsers.has(user.id) ? 'bg-red-50/30' : ''}`}
                  >
                    <td className="p-4 text-center">
                      <button onClick={() => toggleSelectUser(user.id)} className="p-1 rounded-md hover:bg-slate-100 transition-colors">
                        {selectedUsers.has(user.id) ? (
                          <CheckSquare className="w-5 h-5 text-red-600" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-200" />
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100 shadow-sm">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{user.name}</p>
                          <p className="text-[11px] text-slate-500 font-bold">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-700">{user.phone}</td>
                    <td className="p-4 text-sm font-medium text-slate-600">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
                        <BookOpen className="w-3.5 h-3.5" />
                        {userCat?.name || "عام"}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-600">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {userClass?.name || "لم يحدد"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black ${
                        user.status === "نشط" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {user.status || "نشط"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                         <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="bg-red-500 h-full transition-all duration-1000" style={{ width: `${calculateProgress(user.id)}%` }} />
                         </div>
                         <span className="text-[10px] font-black text-slate-400">{calculateProgress(user.id)}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-left relative">
                      <button 
                        onClick={() => setShowActions(showActions === user.id ? null : user.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                        {showActions === user.id && (
                          <div className="absolute left-[30px] top-full mt-2 w-48 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 z-[100] p-2 animate-in fade-in zoom-in-95 slide-in-from-top-2">
                            <button className="w-full flex items-center gap-2 p-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                              <Edit className="w-4 h-4" /> تعديل البيانات
                            </button>
                            <button 
                              onClick={() => {
                                const newStatus = user.status === "نشط" ? "غير نشط" : "نشط";
                                updateUser(user.id, { status: newStatus });
                                setShowActions(null);
                              }}
                              className={`w-full flex items-center gap-2 p-3 text-sm font-bold rounded-xl transition-all ${
                                user.status === "نشط" ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"
                              }`}
                            >
                              {user.status === "نشط" ? (
                                <><Ban className="w-4 h-4" /> تعطيل الحساب</>
                              ) : (
                                <><CheckCircle className="w-4 h-4" /> تنشيط الحساب</>
                              )}
                            </button>
                            <div className="h-px bg-slate-100 my-1"></div>
                            <button 
                              onClick={() => {
                                if(confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
                                  deleteUser(user.id);
                                  setShowActions(null);
                                }
                              }}
                              className="w-full flex items-center gap-2 p-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 className="w-4 h-4" /> حذف الطالب
                            </button>
                          </div>
                        )}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                    <td colSpan="8" className="p-12 text-center text-slate-400 font-bold">
                        لا يوجد طلاب مسجلون بهذا الاسم أو لم يتم تسجيل أي طلاب بعد.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Dummy */}
        <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
          <span>يتم عرض {filteredUsers.length} من أصل {users.filter(u => u.role !== "admin").length} طالب</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">
              &lt;
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-600 text-white font-bold">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">
              3
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
