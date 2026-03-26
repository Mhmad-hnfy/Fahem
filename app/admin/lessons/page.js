"use client";

import React, { useState } from "react";
import { useGlobalStore } from "@/lib/store";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Youtube, 
  FileText, 
  ExternalLink,
  Search,
  Image as LucideImage
} from "lucide-react";
import ImageUpload from "@/Components/ImageUpload";

export default function LessonsManagement() {
  const { 
    categories, 
    classes, 
    chapters, 
    lessons, 
    addLesson, 
    updateLesson, 
    deleteLesson 
  } = useGlobalStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    classId: "",
    chapterId: "",
    youtubeLink: "",
    banner: "",
    pdfFile: "", // Base64 or URL
    status: "نشط",
    maxViews: 5
  });

  const filteredClasses = classes.filter(c => c.categoryId === parseInt(formData.categoryId));
  // Same logic as codes for chapters
  const filteredChapters = chapters.filter(ch => true);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure all linked IDs are stored as integers for correct filtering on student side
    const submissionData = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        classId: parseInt(formData.classId),
        chapterId: parseInt(formData.chapterId)
    };

    if (editingLesson) {
      updateLesson(editingLesson.id, submissionData);
    } else {
      addLesson(submissionData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      categoryId: "",
      classId: "",
      chapterId: "",
      youtubeLink: "",
      banner: "",
      pdfFile: "",
      status: "نشط",
      maxViews: 5
    });
    setEditingLesson(null);
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData({ ...lesson });
    setIsModalOpen(true);
  };

  const handlePdfUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setFormData({ ...formData, pdfFile: reader.result });
          };
          reader.readAsDataURL(file);
      }
  };

  const displayedLessons = lessons.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800">إدارة الدروس</h1>
          <p className="text-slate-500 font-medium">إضافة وتعديل فيديوهات الدروس والملفات المرفقة</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
        >
          <Plus className="w-5 h-5" />
          إضافة درس جديد
        </button>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-6">
        <div className="relative max-w-md mb-6">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث عن درس..."
            className="w-full pr-12 pl-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-red-500 focus:bg-white focus:outline-none font-bold transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedLessons.map((lesson) => {
            const chapter = chapters.find(c => c.id === parseInt(lesson.chapterId));
            return (
              <div key={lesson.id} className="group bg-slate-50 rounded-[32px] overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-500">
                <div className="relative h-48 overflow-hidden bg-slate-200">
                  {lesson.banner ? (
                    <img src={lesson.banner} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={lesson.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <LucideImage className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-xl shadow-lg">
                    <Youtube className="w-5 h-5" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-slate-800 mb-2 truncate">{lesson.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-bold text-slate-500">{chapter?.name || "بدون باب"}</p>
                    <span className="text-xs font-black bg-slate-200 px-2 py-1 rounded-lg">الحد: {lesson.maxViews || 5}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                    <button 
                      onClick={() => handleEdit(lesson)}
                      className="p-2 bg-white text-slate-600 rounded-xl hover:text-red-600 hover:shadow-md transition-all border border-slate-100"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => deleteLesson(lesson.id)}
                      className="p-2 bg-white text-slate-600 rounded-xl hover:text-red-600 hover:shadow-md transition-all border border-slate-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="mr-auto flex items-center gap-2">
                        {lesson.pdfFile && <FileText className="w-5 h-5 text-blue-500" title="يحتوي على PDF" />}
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${lesson.status === "نشط" ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-400"}`}>
                            {lesson.status}
                        </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lesson Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh] border border-white/20 animate-in fade-in zoom-in duration-300">
             <div className="bg-slate-950 p-8 text-white flex items-center justify-between">
                <div>
                   <h3 className="text-2xl font-black">{editingLesson ? "تعديل درس" : "إضافة درس جديد"}</h3>
                   <p className="text-slate-400 text-sm mt-1">أدخل بيانات الدرس والروابط المرفقة</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="pr-2 text-slate-400 hover:text-white transition-colors">
                   <Plus className="w-8 h-8 rotate-45" />
                </button>
             </div>

             <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 block pr-2">اسم الدرس</label>
                    <input
                        type="text"
                        className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-red-500 focus:outline-none font-bold transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-slate-700 block pr-2">المرحلة</label>
                        <select
                            className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-red-500 focus:outline-none font-bold text-sm"
                            value={formData.categoryId}
                            onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                            required
                        >
                            <option value="">اختر</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black text-slate-700 block pr-2">الصف</label>
                        <select
                            className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-red-500 focus:outline-none font-bold text-sm"
                            value={formData.classId}
                            onChange={(e) => setFormData({...formData, classId: e.target.value})}
                            required
                        >
                            <option value="">اختر</option>
                            {filteredClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black text-slate-700 block pr-2">الباب</label>
                        <select
                            className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-red-500 focus:outline-none font-bold text-sm"
                            value={formData.chapterId}
                            onChange={(e) => setFormData({...formData, chapterId: e.target.value})}
                            required
                        >
                            <option value="">اختر</option>
                            {filteredChapters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 block pr-2">رابط فيديو اليوتيوب</label>
                    <input
                        type="url"
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-red-500 focus:outline-none font-bold transition-all"
                        value={formData.youtubeLink}
                        onChange={(e) => setFormData({...formData, youtubeLink: e.target.value})}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 block pr-2">حد المشاهدات لكل طالب</label>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-red-500 focus:outline-none font-bold transition-all"
                        value={formData.maxViews}
                        onChange={(e) => setFormData({...formData, maxViews: parseInt(e.target.value) || 5})}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-slate-700 block pr-2">بانر الفيديو</label>
                        <ImageUpload 
                            value={formData.banner} 
                            onChange={(img) => setFormData({...formData, banner: img})} 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black text-slate-700 block pr-2">ملف PDF (ملخص الدرس)</label>
                        <div className="relative group/pdf h-[200px] border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center bg-slate-50 hover:bg-white hover:border-blue-400 transition-all cursor-pointer">
                            <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                accept="application/pdf"
                                onChange={handlePdfUpload}
                            />
                            <FileText className="w-12 h-12 text-slate-300 mb-2 group-hover/pdf:text-blue-500 transition-colors" />
                            <span className="text-sm font-bold text-slate-500 group-hover/pdf:text-blue-600">
                                {formData.pdfFile ? "تم اختيار ملف" : "اضغط لرفع ملف PDF"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-6">
                    <button type="submit" className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-200 hover:bg-red-700 transition-all">
                        {editingLesson ? "حفظ التغييرات" : "إضافة الدرس"}
                    </button>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all">
                        إلغاء
                    </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
