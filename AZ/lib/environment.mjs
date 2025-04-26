export const env = {
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  isTest: process.env.NODE_ENV === "test",
};

/**
 * هذا سيساعد في تحسين الأداء عن طريق التحكم في الميزات المختلفة
 * بناءً على بيئة التشغيل (تطوير أو إنتاج)
 */
export const features = {
  // تفعيل/تعطيل ميزات اعتماداً على البيئة
  enableDetailedLogs: !env.isProduction,
  enablePerformanceOptimizations: true,
  enableAnimations: true,
};

/**
 * إعدادات أداء التطبيق
 */
export const performance = {
  // القيم الافتراضية المحسنة
  imageLoadingStrategy: "lazy", // 'eager' | 'lazy'
  fontDisplayStrategy: "swap", // 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  prefetchLinks: env.isProduction, // هل يتم تحميل الروابط مسبقاً في الإنتاج
  cacheStrategy: env.isProduction ? "max-age=31536000" : "no-cache",
};
