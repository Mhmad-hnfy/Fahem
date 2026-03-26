"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";

// Create the Context
const GlobalContext = createContext(null);

const defaultData = {
  categories: [],
  teachers: [],
  classes: [],
  courses: [],
  chapters: [],
  lessons: [],
  codes: [],
  users: [],
  currentUser: null,
  currentParent: null,
  unlockedChapters: [],
  lessonViews: [],
  viewCounts: [],
  notifications: [],
  dismissedNotifications: [],
};

// Helper to convert snake_case object to camelCase
const toCamel = (obj) => {
  if (!obj) return obj;
  const newObj = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    newObj[camelKey] = obj[key];
  }
  return newObj;
};

// Helper to convert camelCase object to snake_case
const toSnake = (obj) => {
  if (!obj) return obj;
  const newObj = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    newObj[snakeKey] = obj[key];
  }
  return newObj;
};

export const GlobalProvider = ({ children }) => {
  const [data, setData] = useState(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const withLoading = async (action) => {
    setIsSubmitting(true);
    try {
      await action();
    } catch (err) {
      console.error("Action error:", err);
      alert("حدث خطأ أثناء العملية، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load from Supabase on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: categories },
          { data: teachers },
          { data: classes },
          { data: courses },
          { data: chapters },
          { data: lessons },
          { data: codes },
          { data: users },
          { data: unlockedChapters },
          { data: lessonViews },
          { data: viewCounts },
          { data: notifications },
          { data: dismissedNotifications },
        ] = await Promise.all([
          supabase.from("categories").select("*"),
          supabase.from("teachers").select("*"),
          supabase.from("classes").select("*"),
          supabase.from("courses").select("*"),
          supabase.from("chapters").select("*"),
          supabase.from("lessons").select("*"),
          supabase.from("codes").select("*"),
          supabase.from("users").select("*"),
          supabase.from("unlocked_chapters").select("*"),
          supabase.from("lesson_views").select("*"),
          supabase.from("view_counts").select("*"),
          supabase.from("notifications").select("*"),
          supabase.from("dismissed_notifications").select("*"),
        ]);

        const savedUser = localStorage.getItem("fahemCurrentUser");
        const savedParent = localStorage.getItem("fahemCurrentParent");
        let parsedUser = null;
        let parsedParent = null;
        if (savedUser) {
           try { parsedUser = JSON.parse(savedUser); } catch(e){}
        }
        if (savedParent) {
           try { parsedParent = JSON.parse(savedParent); } catch(e){}
        }

        setData((prev) => ({
          ...prev,
          categories: categories?.map(toCamel) || [],
          teachers: teachers?.map(toCamel) || [],
          classes: classes?.map(toCamel) || [],
          courses: courses?.map(toCamel) || [],
          chapters: chapters?.map(toCamel) || [],
          lessons: lessons?.map(toCamel) || [],
          codes: codes?.map(toCamel) || [],
          users: users?.map(toCamel) || [],
          unlockedChapters: unlockedChapters?.map(toCamel) || [],
          lessonViews: lessonViews?.map(toCamel) || [],
          viewCounts: viewCounts?.map(toCamel) || [],
          notifications: notifications?.map(toCamel) || [],
          dismissedNotifications: dismissedNotifications?.map(toCamel) || [],
          currentUser: parsedUser,
          currentParent: parsedParent,
        }));
      } catch (e) {
        console.error("Error fetching data", e);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchData();
  }, []);

  // Save currentUser session locally
  useEffect(() => {
    if (isLoaded) {
      if (data.currentUser) {
        localStorage.setItem("fahemCurrentUser", JSON.stringify(data.currentUser));
      } else {
        localStorage.removeItem("fahemCurrentUser");
      }
    }
  }, [data.currentUser, isLoaded]);

  // --- Auth Actions ---
  const adminAddUser = async (user) => {
    const exists = data.users.find((u) => u.email === user.email || u.phone === user.phone);
    if (exists) return { success: false, message: "البريد الإلكتروني أو رقم الهاتف موجود بالفعل" };

    const newUser = {
      name: user.name,
      phone: user.phone,
      email: user.email || "",
      whatsapp: user.whatsapp || "",
      parentPhone: user.parentPhone || "",
      parentWhatsapp: user.parentWhatsapp || "",
      categoryId: user.categoryId || null,
      classId: user.classId || null,
      discountCode: user.discountCode || "",
      schoolName: user.schoolName || "",
      religion: user.religion || "",
      gender: user.gender || "",
      birthDate: user.birthDate || "",
      notes: user.notes || "",
      fatherJob: user.fatherJob || "",
      fatherPhone: user.fatherPhone || "",
      password: user.password,
      role: "student",
      status: "نشط",
    };

    const { data: insertedUser, error } = await supabase.from("users").insert(toSnake(newUser)).select().single();
    
    if (error) {
       console.error(error);
       return { success: false, message: "حدث خطأ في إنشاء الحساب" };
    }

    const camelUser = toCamel(insertedUser);
    setData((prev) => ({
      ...prev,
      users: [...prev.users, camelUser],
    }));
    return { success: true, user: camelUser };
  };

  const registerUser = async (user) => {
    const res = await adminAddUser(user);
    if (res.success) {
      setData((prev) => ({ ...prev, currentUser: res.user }));
    }
    return res;
  };

  const loginUser = (phone, password) => {
    const user = data.users.find((u) => u.phone === phone && u.password === password);
    if (user) {
      setData((prev) => ({ ...prev, currentUser: user }));
      return { success: true, user };
    }
    return { success: false, message: "بيانات الدخول غير صحيحة" };
  };

  const logoutUser = () => {
    setData((prev) => ({ ...prev, currentUser: null }));
  };

  // --- Teacher Actions ---
  const addTeacher = (teacher) => withLoading(async () => {
    const newTeacher = { ...teacher, students: 0, status: "نشط" };
    const { data: inserted, error } = await supabase.from("teachers").insert(toSnake(newTeacher)).select().single();
    if (!error && inserted) setData((prev) => ({ ...prev, teachers: [...prev.teachers, toCamel(inserted)] }));
  });

  const updateTeacher = (id, updatedFields) => withLoading(async () => {
    const { error } = await supabase.from("teachers").update(toSnake(updatedFields)).eq("id", id);
    if (!error) setData((prev) => ({ ...prev, teachers: prev.teachers.map((t) => (t.id === id ? { ...t, ...updatedFields } : t)) }));
  });

  const deleteTeacher = (id) => withLoading(async () => {
    const { error } = await supabase.from("teachers").delete().eq("id", id);
    if (!error) setData((prev) => ({ ...prev, teachers: prev.teachers.filter((t) => t.id !== id) }));
  });

  // --- Category ---
  const addCategory = (cat) => withLoading(async () => {
    const { data: inserted, error } = await supabase.from("categories").insert(toSnake(cat)).select().single();
    if (!error && inserted) setData((p) => ({ ...p, categories: [...p.categories, toCamel(inserted)] }));
  });
  const updateCategory = (id, fields) => withLoading(async () => {
    const { error } = await supabase.from("categories").update(toSnake(fields)).eq("id", id);
    if (!error) setData((p) => ({ ...p, categories: p.categories.map((c) => (c.id === id ? { ...c, ...fields } : c)) }));
  });
  const deleteCategory = (id) => withLoading(async () => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) setData((p) => ({ ...p, categories: p.categories.filter((c) => c.id !== id) }));
  });

  // --- Class ---
  const addClass = (cls) => withLoading(async () => {
    const { data: inserted, error } = await supabase.from("classes").insert(toSnake(cls)).select().single();
    if (!error && inserted) setData((p) => ({ ...p, classes: [...p.classes, toCamel(inserted)] }));
  });
  const updateClass = (id, fields) => withLoading(async () => {
    const { error } = await supabase.from("classes").update(toSnake(fields)).eq("id", id);
    if (!error) setData((p) => ({ ...p, classes: p.classes.map((c) => (c.id === id ? { ...c, ...fields } : c)) }));
  });
  const deleteClass = (id) => withLoading(async () => {
    const { error } = await supabase.from("classes").delete().eq("id", id);
    if (!error) setData((p) => ({ ...p, classes: p.classes.filter((c) => c.id !== id) }));
  });

  // --- Course ---
  const addCourse = (crs) => withLoading(async () => {
    const { data: inserted, error } = await supabase.from("courses").insert(toSnake(crs)).select().single();
    if (!error && inserted) setData((p) => ({ ...p, courses: [...p.courses, toCamel(inserted)] }));
  });
  const updateCourse = (id, fields) => withLoading(async () => {
    const { error } = await supabase.from("courses").update(toSnake(fields)).eq("id", id);
    if (!error) setData((p) => ({ ...p, courses: p.courses.map((c) => (c.id === id ? { ...c, ...fields } : c)) }));
  });
  const deleteCourse = (id) => withLoading(async () => {
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (!error) setData((p) => ({ ...p, courses: p.courses.filter((c) => c.id !== id) }));
  });

  // --- Chapter ---
  const addChapter = (chp) => withLoading(async () => {
    const { data: inserted, error } = await supabase.from("chapters").insert(toSnake(chp)).select().single();
    if (!error && inserted) setData((p) => ({ ...p, chapters: [...p.chapters, toCamel(inserted)] }));
  });
  const updateChapter = (id, fields) => withLoading(async () => {
    const { error } = await supabase.from("chapters").update(toSnake(fields)).eq("id", id);
    if (!error) setData((p) => ({ ...p, chapters: p.chapters.map((c) => (c.id === id ? { ...c, ...fields } : c)) }));
  });
  const deleteChapter = (id) => withLoading(async () => {
    const { error } = await supabase.from("chapters").delete().eq("id", id);
    if (!error) setData((p) => ({ ...p, chapters: p.chapters.filter((c) => c.id !== id) }));
  });

  // --- Lesson ---
  const addLesson = (lesson) => withLoading(async () => {
    const newLesson = { ...lesson, views: 0, maxViews: lesson.maxViews || 5 };
    const { data: inserted, error } = await supabase.from("lessons").insert(toSnake(newLesson)).select().single();
    if (!error && inserted) setData((prev) => ({ ...prev, lessons: [...prev.lessons, toCamel(inserted)] }));
  });
  const updateLesson = (id, fields) => withLoading(async () => {
    const { error } = await supabase.from("lessons").update(toSnake(fields)).eq("id", id);
    if (!error) setData((p) => ({ ...p, lessons: p.lessons.map((l) => (l.id === id ? { ...l, ...fields } : l)) }));
  });
  const deleteLesson = (id) => withLoading(async () => {
    const { error } = await supabase.from("lessons").delete().eq("id", id);
    if (!error) setData((p) => ({ ...p, lessons: p.lessons.filter((l) => l.id !== id) }));
  });

  // --- Code Actions ---
  const generateCodes = (count, details) => withLoading(async () => {
    const newCodes = [];
    for (let i = 0; i < count; i++) {
        const codeString = Math.random().toString(36).substring(2, 10).toUpperCase();
        newCodes.push({
            code: codeString,
            classId: details.classId,
            categoryId: details.categoryId,
            chapterId: details.chapterId,
            maxUses: details.maxUses || 1,
            usedCount: 0,
            active: true,
        });
    }
    const { data: inserted, error } = await supabase.from("codes").insert(newCodes.map(toSnake)).select();
    if (!error && inserted) {
      setData((prev) => ({ ...prev, codes: [...prev.codes, ...inserted.map(toCamel)] }));
    }
  });

  const deleteCode = (id) => withLoading(async () => {
    const { error } = await supabase.from("codes").delete().eq("id", id);
    if (!error) setData((prev) => ({ ...prev, codes: prev.codes.filter((c) => c.id !== id) }));
  });

  const deleteCodes = (ids) => withLoading(async () => {
    const { error } = await supabase.from("codes").delete().in("id", ids);
    if (!error) setData((prev) => ({ ...prev, codes: prev.codes.filter((c) => !ids.includes(c.id)) }));
  });

  const verifyAndUseCode = async (codeString, userId) => {
    const codeObj = data.codes.find((c) => c.code === codeString && c.active);
    if (!codeObj) return { success: false, message: "الكود غير صالح أو غير موجود" };
    if (codeObj.usedCount >= codeObj.maxUses) return { success: false, message: "هذا الكود تم استخدامه مسبقاً للحد الأقصى" };

    const alreadyUnlocked = data.unlockedChapters.find((u) => u.userId === userId && u.chapterId === codeObj.chapterId);

    const newUsedCount = codeObj.usedCount + 1;
    await supabase.from("codes").update({ used_count: newUsedCount }).eq("id", codeObj.id);

    if (alreadyUnlocked) {
        const chapterLessons = data.lessons.filter(l => parseInt(l.chapterId) === parseInt(codeObj.chapterId));
        const lessonIds = chapterLessons.map(l => l.id);

        for (const lId of lessonIds) {
            await supabase.from("view_counts").update({ count: 0 }).eq("user_id", userId).eq("lesson_id", lId);
        }

        setData((prev) => ({
            ...prev,
            codes: prev.codes.map((c) => (c.id === codeObj.id ? { ...c, usedCount: newUsedCount } : c)),
            lessonViews: prev.lessonViews.map(v => 
                (v.userId === userId && lessonIds.includes(v.lessonId)) ? { ...v, viewCount: 0 } : v
            ),
            viewCounts: prev.viewCounts.map(v => 
                (v.userId === userId && lessonIds.includes(v.lessonId)) ? { ...v, count: 0 } : v
            )
        }));
    } else {
        const { data: unlocked } = await supabase.from("unlocked_chapters").insert(toSnake({ userId, chapterId: codeObj.chapterId })).select().single();
        
        setData((prev) => ({
            ...prev,
            codes: prev.codes.map((c) => (c.id === codeObj.id ? { ...c, usedCount: newUsedCount } : c)),
            unlockedChapters: unlocked ? [...prev.unlockedChapters, toCamel(unlocked)] : prev.unlockedChapters
        }));
    }

    return { success: true, message: "تم تفعيل الباب بنجاح" };
  };

  const incrementLessonView = async (userId, lessonId) => {
    if (!userId || !lessonId) return;
    
    // optimistically update local state
    setData((prev) => {
        const currentViewCounts = prev.viewCounts || [];
        const existingCountIndex = currentViewCounts.findIndex(v => v.userId === userId && v.lessonId === lessonId);
        let newViewCounts = [...currentViewCounts];
        if (existingCountIndex > -1) {
            newViewCounts[existingCountIndex] = { ...newViewCounts[existingCountIndex], count: newViewCounts[existingCountIndex].count + 1 };
        } else {
            newViewCounts.push({ userId, lessonId, count: 1 });
        }
        return {
            ...prev,
            viewCounts: newViewCounts,
        };
    });

    const existing = data.viewCounts.find(v => v.userId === userId && v.lessonId === lessonId);
    if (existing) {
       await supabase.from("view_counts").update({ count: existing.count + 1 }).eq("id", existing.id);
    } else {
       await supabase.from("view_counts").insert(toSnake({ userId, lessonId, count: 1 }));
       await supabase.from("lesson_views").insert(toSnake({ userId, lessonId }));
    }
  };

  const deleteUser = (id) => withLoading(async () => {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (!error) setData((prev) => ({ ...prev, users: prev.users.filter((u) => u.id !== id) }));
  });

  // --- Notifications ---
  const addNotification = (notif) => withLoading(async () => {
    const { data: inserted, error } = await supabase.from("notifications").insert(toSnake(notif)).select().single();
    if (!error && inserted) setData((p) => ({ ...p, notifications: [toCamel(inserted), ...p.notifications] }));
  });

  const deleteNotification = (id) => withLoading(async () => {
    const { error } = await supabase.from("notifications").delete().eq("id", id);
    if (!error) setData((p) => ({ ...p, notifications: p.notifications.filter((n) => n.id !== id) }));
  });

  const dismissNotification = (userId, notificationId) => withLoading(async () => {
    const { data: inserted, error } = await supabase.from("dismissed_notifications").insert(toSnake({ userId, notificationId })).select().single();
    if (!error && inserted) {
      setData((p) => ({ ...p, dismissedNotifications: [...p.dismissedNotifications, toCamel(inserted)] }));
    }
  });

  const updateUser = (id, updates) => withLoading(async () => {
    const { error } = await supabase.from("users").update(toSnake(updates)).eq("id", id);
    if (!error) {
      setData((prev) => {
        const updatedUsers = prev.users.map((u) => (u.id === id ? { ...u, ...updates } : u));
        const updatedCurrentUser = prev.currentUser && prev.currentUser.id === id ? { ...prev.currentUser, ...updates } : prev.currentUser;
        return { ...prev, users: updatedUsers, currentUser: updatedCurrentUser };
      });
    }
  });

  const loginParent = async (parentPhone, studentPhone) => {
    const student = data.users.find(u => u.phone === studentPhone && u.parentPhone === parentPhone);
    if (!student) return { success: false, message: "بيانات الدخول غير صحيحة أو الطالب غير مسجل برقم هاتف ولي الأمر هذا." };
    
    const parentSession = { parentPhone };
    localStorage.setItem("fahemCurrentParent", JSON.stringify(parentSession));
    setData(prev => ({ ...prev, currentParent: parentSession }));
    return { success: true };
  };

  const logoutParent = () => {
    localStorage.removeItem("fahemCurrentParent");
    setData(prev => ({ ...prev, currentParent: null }));
  };

  return (
    <GlobalContext.Provider
      value={{
        ...data,
        isLoaded,
        isSubmitting,
        registerUser,
        loginUser,
        logoutUser,
        adminAddUser,
        loginParent,
        logoutParent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addCategory,
        updateCategory,
        deleteCategory,
        addClass,
        updateClass,
        deleteClass,
        addCourse,
        updateCourse,
        deleteCourse,
        addChapter,
        updateChapter,
        deleteChapter,
        addLesson,
        updateLesson,
        deleteLesson,
        generateCodes,
        deleteCode,
        deleteCodes,
        verifyAndUseCode,
        incrementLessonView,
        deleteUser,
        updateUser,
        addNotification,
        deleteNotification,
        dismissNotification,
      }}
    >
      {isSubmitting && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", direction: "rtl" }}>
          <div style={{ backgroundColor: "#ffffff", padding: "20px 40px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <div style={{ width: "30px", height: "30px", border: "4px solid #f3f3f3", borderTop: "4px solid #ef4444", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>جاري تحديث البيانات...</span>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      )}
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalStore = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobalStore must be used within a GlobalProvider");
  return context;
};
