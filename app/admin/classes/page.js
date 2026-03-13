"use client";

import React, { useState } from "react";
import { Plus, BookOpen, Clock, Users, Edit3, Trash } from "lucide-react";
import { useGlobalStore } from "@/lib/store";
import ImageUpload from "@/Components/ImageUpload";

export default function ClassesManagement() {
  const [editingClass, setEditingClass] = useState(null);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");

  const {
    classes: classesList,
    categories,
    addClass,
    updateClass,
    deleteClass,
  } = useGlobalStore();

  const handleAddClass = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newClass = {
      name: formData.get("name"),
      categoryId: parseInt(formData.get("categoryId"), 10),
      image: uploadedImage,
      active: formData.get("isActive") === "on",
    };
    addClass(newClass);
    setShowAddClassModal(false);
    setUploadedImage("");
  };

  const handleUpdateClass = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedClass = {
      name: formData.get("name"),
      categoryId: parseInt(formData.get("categoryId"), 10),
      image: uploadedImage,
      active: formData.get("isActive") === "on",
    };
    updateClass(editingClass.id, updatedClass);
    setEditingClass(null);
    setUploadedImage("");
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            إدارة الصفوف الدراسية
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            التحكم في الأقسام والمراحل الدراسية المتاحة على المنصة.
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddClassModal(true);
            setUploadedImage("");
          }}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-200 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          إضافة صف جديد
        </button>
      </div>

      {/* Classes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classesList.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center hover:shadow-md transition-shadow group"
          >
            {/* Icon Block */}
            <div
              className={`w-20 h-20 rounded-[20px] flex items-center justify-center shrink-0 overflow-hidden relative border ${
                cls.active
                  ? "bg-red-50 text-red-600 border-red-100"
                  : "bg-slate-100 text-slate-400 border-slate-200"
              }`}
            >
              {cls.image ? (
                <img src={cls.image} alt={cls.name} className="w-full h-full object-cover" />
              ) : (
                <BookOpen className="w-8 h-8" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-right w-full">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-black text-slate-900 group-hover:text-red-600 transition-colors">
                  {cls.name}
                  <span className="block text-sm font-normal text-slate-500 mt-1">
                    {categories.find((cat) => cat.id === cls.categoryId)
                      ?.name || "فئة غير معروفة"}
                  </span>
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full hidden sm:inline-block ${
                    cls.active
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {cls.active ? "مفعل" : "مغلق"}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-start text-sm text-slate-500 mb-4">
                <div className="flex items-center gap-1.5 font-bold">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>
                    {(cls.studentsCount || 0).toLocaleString("en-US")} طالب
                  </span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                <div className="flex items-center gap-1.5 font-bold">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>{cls.coursesCount || 0} كورس</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-center sm:justify-start">
                <button
                  onClick={() => {
                    setEditingClass(cls);
                    setUploadedImage(cls.image || "");
                  }}
                  className="flex items-center gap-1 text-sm font-bold text-slate-400 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" /> تعديل
                </button>
                <button
                  onClick={() => deleteClass(cls.id)}
                  className="flex items-center gap-1 text-sm font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <Trash className="w-4 h-4" /> حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Class Modal */}
      {(showAddClassModal || editingClass) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-8">
            <h2 className="text-2xl font-black text-slate-800 mb-6">
              {editingClass ? "تعديل بيانات الصف" : "إضافة صف دراسي جديد"}
            </h2>

            <form
              className="space-y-6"
              onSubmit={editingClass ? handleUpdateClass : handleAddClass}
            >
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  اسم الصف الدراسي
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingClass ? editingClass.name : ""}
                  placeholder="مثال: الصف الأول الإعدادي"
                  className="w-full border border-slate-200 rounded-xl p-3 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  يتبع الفئة الدراسية
                </label>
                <select
                  name="categoryId"
                  defaultValue={editingClass ? editingClass.categoryId : ""}
                  className="w-full border border-slate-200 rounded-xl p-3 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none bg-white"
                  required
                >
                  <option value="">اختر الفئة الدراسية...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  صورة الصف الدراسي (اختياري)
                </label>
                <ImageUpload value={uploadedImage} onChange={setUploadedImage} />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  defaultChecked={editingClass ? editingClass.active : true}
                  className="w-5 h-5 accent-red-600 border-slate-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-bold text-slate-700"
                >
                  تفعيل الصف مباشرة
                </label>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="submit"
                  className="flex-1 py-3 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-all"
                >
                  {editingClass ? "حفظ التعديلات" : "إضافة الصف"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddClassModal(false);
                    setEditingClass(null);
                    setUploadedImage("");
                  }}
                  className="px-6 py-3 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
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
