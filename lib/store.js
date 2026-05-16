"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";
import bcrypt from "bcryptjs";

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
          // SECURITY: password field is intentionally excluded — never sent to client
          supabase.from("users").select("id, name, phone, email, role, status, class_id, category_id, parent_phone, whatsapp, parent_whatsapp, school_name, religion, gender, birth_date, notes, father_job, father_phone, discount_code, created_at"),
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

        // SECURITY: Sync cookie with localStorage session to prevent middleware redirect
        if (parsedUser && parsedUser.role) {
          document.cookie = `fahem_role=${parsedUser.role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        }

        setIsLoaded(true);
      } catch (e) {
        console.error("Error fetching data", e);
        setIsLoaded(true);
      }
    };
    fetchData();
  }, []);

  // Save currentUser to localStorage whenever it changes
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

    // SECURITY: Hash password before storing — never store plaintext
    const hashedPassword = await bcrypt.hash(user.password, 12);

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
      password: hashedPassword, // SECURITY: store bcrypt hash
      role: "student",
      status: "نشط",
    };

    // Select without password — never return password to client
    const { data: insertedUser, error } = await supabase
      .from("users")
      .insert(toSnake(newUser))
      .select("id, name, phone, email, role, status, class_id, category_id, parent_phone, whatsapp, parent_whatsapp, school_name, religion, gender, birth_date, notes, father_job, father_phone, discount_code, created_at")
      .single();
    
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

  // SECURITY: Login is now server-side via API route — password never compared client-side
  const loginUser = async (phone, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const result = await response.json();
      if (result.success) {
        setData((prev) => ({ ...prev, currentUser: result.user }));
        return { success: true, user: result.user };
      }
      return { success: false, message: result.message };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "خطأ في الاتصال بالخادم" };
    }
  };

  const logoutUser = () => {
    setData((prev) => ({ ...prev, currentUser: null }));
    // Clear the role cookie set by the login API
    document.cookie = "fahem_role=; path=/; max-age=0";
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
  // SECURITY: Use crypto.getRandomValues instead of Math.random (not cryptographically secure)
  const _generateSecureCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const array = new Uint8Array(8);
    crypto.getRandomValues(array);
    return Array.from(array, (b) => chars[b % chars.length]).join("");
  };

  const generateCodes = (count, details) => withLoading(async () => {
    const newCodes = [];
    const existingCodeStrings = new Set(data.codes.map((c) => c.code));
    for (let i = 0; i < count; i++) {
        let codeString;
        // Ensure uniqueness
        do { codeString = _generateSecureCode(); } while (existingCodeStrings.has(codeString));
        existingCodeStrings.add(codeString);
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

  // SECURITY: Moved verification to database RPC (Server-side) to prevent tampering
  const verifyAndUseCode = async (codeString, userId) => {
    try {
      const { data: result, error } = await supabase.rpc('verify_and_use_code', {
        p_code: codeString,
        p_user_id: userId
      });

      if (error) throw error;

      if (result.success) {
        // Refresh local data to reflect changes (unlocked_chapters, etc)
        await fetchData();
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (err) {
      console.error("Code verification error:", err);
      return { success: false, message: "خطأ أثناء التحقق من الكود" };
    }
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
