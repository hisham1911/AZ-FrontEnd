"use client";

/**
 * وظائف لتحسين الأداء وتجربة المستخدم
 */

/**
 * تأخير تنفيذ المهام غير الضرورية بعد تحميل الصفحة
 * @param {Function} callback الدالة التي ستنفذ
 * @param {number} delay التأخير بالمللي ثانية
 */
export function deferTask(callback, delay = 1000) {
  if (typeof window === "undefined") return;
  
  // استخدام requestIdleCallback إذا كان متاحًا، وإلا استخدام setTimeout
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      setTimeout(callback, delay);
    });
  } else {
    setTimeout(callback, delay);
  }
}

/**
 * تقسيم المهام الثقيلة لتجنب تجميد واجهة المستخدم
 * @param {Array} items العناصر التي سيتم معالجتها
 * @param {Function} processor الدالة التي ستعالج كل عنصر
 * @param {number} batchSize حجم المجموعة (عدد العناصر في الدفعة الواحدة)
 * @param {number} delay التأخير بين الدفعات
 * @returns {Promise} وعد يتم حله عند اكتمال جميع المعالجات
 */
export function processBatch(items, processor, batchSize = 5, delay = 10) {
  return new Promise((resolve) => {
    if (!items.length) {
      resolve();
      return;
    }

    const batchProcessor = (startIndex) => {
      const endIndex = Math.min(startIndex + batchSize, items.length);
      const batch = items.slice(startIndex, endIndex);
      
      // معالجة الدفعة الحالية
      batch.forEach(processor);
      
      // التحقق مما إذا انتهينا من جميع العناصر
      if (endIndex >= items.length) {
        resolve();
        return;
      }
      
      // جدولة الدفعة التالية
      setTimeout(() => batchProcessor(endIndex), delay);
    };
    
    // بدء المعالجة من العنصر الأول
    batchProcessor(0);
  });
}

/**
 * تحسين تفاعلات المستخدم من خلال تقليل تكرار الأحداث
 * @param {Function} func الدالة التي سيتم تنفيذها
 * @param {number} wait فترة الانتظار بالمللي ثانية
 * @returns {Function} دالة مُحسّنة
 */
export function debounce(func, wait = 100) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * تقييد معدل تنفيذ الوظائف (مفيد جدًا للأحداث المتكررة مثل التمرير)
 * @param {Function} func الدالة التي سيتم تنفيذها
 * @param {number} limit الحد الأدنى للوقت بين التنفيذات
 * @returns {Function} دالة مُحسّنة
 */
export function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
