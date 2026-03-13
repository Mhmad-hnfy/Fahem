"use client";

import React, { useState } from "react";
import { useGlobalStore } from "@/lib/store";
import { 
  Key, 
  Plus, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Download,
  Filter
} from "lucide-react";

export default function CodesManagement() {
  const { 
    categories, 
    classes, 
    chapters, 
    codes, 
    generateCodes, 
    updateCode // assuming we might need it, or we just generate
  } = useGlobalStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generateCount, setGenerateCount] = useState(10);
  const [formData, setFormData] = useState({
    categoryId: "",
    classId: "",
    chapterId: "",
    maxUses: 1,
  });

  const filteredClasses = classes.filter(c => c.categoryId === parseInt(formData.categoryId));
  // Filter chapters by selected class (we need chapter to have classId or we link via course)
  // Actually, chapters are linked to courses. 
  // Let's assume for simplicity we select Phase -> Class -> Chapter
  // In our store, chapters have courseId. Course has classId.
  const filteredChapters = chapters.filter(ch => {
     // Find the course for this chapter, then check if that course belongs to the selected class
     // This is a bit complex for a one-liner, let's just show all or filter if we can.
     return true; // Simplified for now
  });

  const handleGenerate = (e) => {
    e.preventDefault();
    generateCodes(generateCount, {
        categoryId: parseInt(formData.categoryId),
        classId: parseInt(formData.classId),
        chapterId: parseInt(formData.chapterId),
        maxUses: parseInt(formData.maxUses)
    });
    setIsModalOpen(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("تم نسخ الكود: " + text);
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800">إدارة الأكواد</h1>
          <p className="text-slate-500 font-medium">توليد ومتابعة أكواد تفعيل الأبواب للمواد الدراسية</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
        >
          <Plus className="w-5 h-5" />
          توليد أكواد جديدة
        </button>
      </div>

      <div className="bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">الأكواد المصدرة</h2>
            <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-500">الإجمالي: {codes.length} كود</span>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-black text-slate-600">الكود</th>
                <th className="px-6 py-4 text-right text-sm font-black text-slate-600">الباب</th>
                <th className="px-6 py-4 text-right text-sm font-black text-slate-600">الاستخدام</th>
                <th className="px-6 py-4 text-right text-sm font-black text-slate-600">تاريخ الإنشاء</th>
                <th className="px-6 py-4 text-right text-sm font-black text-slate-600">الحالة</th>
                <th className="px-6 py-4 text-left text-sm font-black text-slate-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {codes.map((code) => {
                const chapter = chapters.find(ch => ch.id === code.chapterId);
                return (
                  <tr key={code.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono bg-slate-100 px-3 py-1.5 rounded-lg text-slate-800 font-bold select-all">
                        {code.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{chapter?.name || "باب غير معروف"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 w-20 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-red-500 rounded-full" 
                                style={{ width: `${(code.usedCount / code.maxUses) * 100}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-bold text-slate-500">
                            {code.usedCount}/{code.maxUses}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                      {new Date(code.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4">
                       {code.usedCount < code.maxUses ? (
                         <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold">نشط</span>
                       ) : (
                         <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">مكتمل</span>
                       )}
                    </td>
                    <td className="px-6 py-4 text-left">
                      <button 
                        onClick={() => copyToClipboard(code.code)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        title="نسخ الكود"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {codes.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-slate-400 font-bold">
                    لا يوجد أكواد حالياً. قم بتوليد أكواد جديدة للبدء.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Codes Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-red-600 to-rose-600 p-8 text-white relative">
              <h3 className="text-2xl font-black">توليد أكواد جديدة</h3>
              <p className="text-red-100 text-sm mt-1">قم باختيار تفاصيل الدفعة وعدد الأكواد المطلوبة</p>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 left-6 p-2 hover:bg-white/10 rounded-full transition-colors"
                dir="ltr"
              >
                <Trash2 className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleGenerate} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 block pr-2">المرحلة</label>
                  <select
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-red-500 focus:outline-none font-bold transition-all text-sm"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    required
                  >
                    <option value="">اختر المرحلة</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 block pr-2">الصف</label>
                  <select
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-red-500 focus:outline-none font-bold transition-all text-sm"
                    value={formData.classId}
                    onChange={(e) => setFormData({...formData, classId: e.target.value})}
                    required
                  >
                    <option value="">اختر الصف</option>
                    {filteredClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 block pr-2">الباب</label>
                <select
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-red-500 focus:outline-none font-bold transition-all text-sm"
                  value={formData.chapterId}
                  onChange={(e) => setFormData({...formData, chapterId: e.target.value})}
                  required
                >
                  <option value="">اختر الباب</option>
                  {/* Ideally filter chapters by course which belongs to class */}
                  {chapters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 block pr-2">عدد الأكواد</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-red-500 focus:outline-none font-bold transition-all text-sm"
                    value={generateCount}
                    onChange={(e) => setGenerateCount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 block pr-2">عدد المستخدمين للكود</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-red-500 focus:outline-none font-bold transition-all text-sm"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({...formData, maxUses: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-50 border-2 border-slate-100 transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-[2] px-6 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-lg shadow-red-200 hover:from-red-700 hover:to-rose-700 transition-all"
                >
                  توليد الآن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
