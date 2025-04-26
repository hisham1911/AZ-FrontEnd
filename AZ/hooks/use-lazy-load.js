"use client";

import { useState, useEffect } from "react";

/**
 * Hook لتحميل المكونات بشكل كسول لتحسين الأداء الأولي
 * @param {boolean} [initialState=false] الحالة الأولية للتحميل
 * @param {number} [delay=0] تأخير التحميل بالمللي ثانية
 * @param {boolean} [skipCondition=false] شرط لتخطي التحميل الكسول
 * @returns {boolean} حالة التحميل
 */
export function useLazyLoad(initialState = false, delay = 0, skipCondition = false) {
  const [isLoaded, setIsLoaded] = useState(initialState || skipCondition);

  useEffect(() => {
    // إذا كان يجب تخطي التحميل الكسول، نعيد true مباشرة
    if (skipCondition) {
      setIsLoaded(true);
      return;
    }

    // لا داعي للتحميل المتأخر إذا كانت الحالة الأولية true بالفعل
    if (initialState) return;

    // تأخير التحميل إذا تم تحديد تأخير
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [initialState, delay, skipCondition]);

  return isLoaded;
}

/**
 * Hook لتحميل المكونات عند ظهورها في الشاشة
 * يساعد على تحسين الأداء بشكل كبير للصفحات الطويلة
 * @param {Object} options خيارات مراقبة التقاطع
 * @returns {Object} مرجع العنصر وحالة الرؤية
 */
export function useVisibleLoad(options = { threshold: 0.1 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return { ref: setRef, isVisible };
}
