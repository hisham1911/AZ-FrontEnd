/** @type {import('next').NextConfig} */
const nextConfig = {
  // إعدادات الأساسية
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // تحسين الصور
  images: {
    unoptimized: true, // يمكن تعديله إلى false في الإنتاج لتحسين الأداء
    domains: ["hebbkx1anhila5yf.public.blob.vercel-storage.com"],
    formats: ["image/avif", "image/webp"],
  },

  // تحسينات تجريبية
  experimental: {
    // تعطيل optimizeCss لتجنب مشاكل مع critters
    optimizeCss: false,
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
    webVitalsAttribution: ["CLS", "LCP", "FID", "INP"], // تتبع جميع مصادر مشاكل الأداء
    // تسريع المجمع المعتمد على Rust
    swcMinify: true,
  },

  // تحسين معالجة المكونات الخارجية
  serverExternalPackages: ["sharp"],

  // تحسينات المترجم
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // تحسين التحميل
  reactStrictMode: false, // يمكن تعطيله مؤقتاً لتحسين الأداء في التطوير

  // تسريع التحميل
  compress: true, // تفعيل الضغط (الافتراضي هو true لكن للتأكيد)
  poweredByHeader: false, // إزالة ترويسة X-Powered-By

  // تسريع تحميل الصفحة
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // زيادة وقت الاحتفاظ بالصفحات المحملة
    pagesBufferLength: 5, // عدد الصفحات المحملة مسبقاً
  },
};

export default nextConfig;
