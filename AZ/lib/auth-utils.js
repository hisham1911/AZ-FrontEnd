"use client";

/**
 * وظائف مساعدة للمصادقة في لوحة تحكم المشرف
 */

// إعدادات API
const API_URL = "https://localhost:7246/api";

/**
 * التحقق من حالة تسجيل الدخول
 * @returns {boolean} ما إذا كان المستخدم مصادق عليه
 */
export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('adminAuthenticated') === 'true';
}

/**
 * تنفيذ تسجيل الدخول باستخدام API
 * @param {string} email البريد الإلكتروني
 * @param {string} password كلمة المرور
 * @returns {Promise<{success: boolean, message: string}>} نتيجة تسجيل الدخول
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/Acount/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.text();
    
    if (data.includes("Login successful")) {
      // تخزين حالة تسجيل الدخول
      localStorage.setItem('adminAuthenticated', 'true');
      return { success: true, message: 'تم تسجيل الدخول بنجاح' };
    } else {
      return { success: false, message: 'فشل تسجيل الدخول: بيانات الاعتماد غير صالحة' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: `خطأ في الاتصال بالخادم: ${error.message}` 
    };
  }
}

/**
 * تنفيذ تسجيل الخروج
 */
export function logout() {
  localStorage.removeItem('adminAuthenticated');
}
