"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * مكون لودر الصفحة - إصدار أبسط يعمل بشكل مضمون
 */
export function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // مراقبة تغييرات المسار وبدء التحميل
  useEffect(() => {
    // عند تغيير المسار، نبدأ التحميل
    setIsLoading(true);
    setLoadingProgress(0);
    
    // زيادة تدريجية للتقدم
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(timer);
          return prev;
        }
        return prev + 10;
      });
    }, 100);
    
    // انتهاء التحميل
    const completeTimer = setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => setIsLoading(false), 200);
    }, 500);
    
    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [pathname, searchParams]);
  
  if (!isLoading && loadingProgress === 0) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1">
      <div 
        className="h-full bg-primary transition-all duration-300 ease-in-out" 
        style={{ width: `${loadingProgress}%` }}
      />
    </div>
  );
}

/**
 * مكون لودر للصفحة الكاملة
 */
export function FullPageLoader({ message = "جاري التحميل..." }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p className="mt-4 text-foreground font-medium">{message}</p>
    </div>
  );
}

/**
 * مكون لودر للأزرار والعناصر الصغيرة
 */
export function ButtonLoader({ size = "md", className = "" }) {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`border-2 border-primary/30 border-t-primary rounded-full animate-spin ${sizeMap[size]}`} />
    </div>
  );
}

/**
 * لودر الصفحة الكاملة (للاستخدام في صفحات التحميل الكاملة)
 */
export function FullPageLoader({ message = "جاري التحميل..." }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="relative h-20 w-20">
        <div className="spinner-large"></div>
      </div>
      <p className="mt-4 text-muted-foreground">{message}</p>
    </div>
  );
}
