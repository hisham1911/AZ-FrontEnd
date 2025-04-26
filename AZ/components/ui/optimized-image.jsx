"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { performance } from "@/lib/environment.mjs";

/**
 * مكون صورة محسن يدعم التحميل الكسول والتدريجي
 * يساعد على تحسين WebVitals وتجربة المستخدم
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // استراتيجية التحميل - تكون eager للصور ذات الأولوية وlazy للبقية
  const loadingStrategy = priority ? "eager" : performance.imageLoadingStrategy;

  useEffect(() => {
    // للاستخدام في المستقبل: إضافة مراقبة الرؤية للتحميل عند الظهور فقط
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    // التقاط العنصر الحالي إذا كان موجوداً في DOM
    const element = document.getElementById(`img-${src.replace(/\W/g, "")}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [src]);

  return (
    <div
      id={`img-${src.replace(/\W/g, "")}`}
      className={`relative overflow-hidden ${className || ""}`}
      style={{
        width: width || "100%",
        height: height || "auto",
      }}
    >
      <Image
        src={src}
        alt={alt || "صورة"}
        width={parseInt(width) || 500}
        height={parseInt(height) || 300}
        quality={75}
        loading={loadingStrategy}
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        {...props}
      />
    </div>
  );
}
