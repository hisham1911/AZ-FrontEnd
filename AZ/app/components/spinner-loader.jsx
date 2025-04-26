"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function SpinnerLoader() {
  const pathname = usePathname();
  const [showLoader, setShowLoader] = useState(false);

  // استمع لأحداث النقر على الروابط
  useEffect(() => {
    // تتبع النقرات على روابط التنقل
    const handleLinkClick = (e) => {
      // التحقق من أن العنصر المنقور عليه هو رابط
      const linkElement = e.target.closest("a");
      if (linkElement) {
        const href = linkElement.getAttribute("href");
        // تجاهل الروابط الخارجية والروابط التي لا تبدأ بـ /
        if (
          href &&
          (href.startsWith("/") || href.startsWith("#")) &&
          !href.includes("http")
        ) {
          setShowLoader(true);
        }
      }
    };

    // عند تغيير المسار، تأكد من أن اللودر يظهر
    setShowLoader(true);

    // إضافة مستمع الأحداث للنقرات
    document.addEventListener("click", handleLinkClick);

    // إخفاء اللودر بعد فترة
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 800);

    return () => {
      document.removeEventListener("click", handleLinkClick);
      clearTimeout(timer);
    };
  }, [pathname]);

  if (!showLoader) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-[9999]">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-blue-100 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          {/* يمكن استبدال هذا بشعار الموقع */}
          <Image
            src="/images/az-logo.png"
            alt="شعار الموقع"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

// لودر سبنر مركزي بدون خلفية (يمكن استخدامه في أي مكان)
export function CenteredSpinner({ size = "md" }) {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className={`relative ${sizes[size]}`}>
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-blue-100 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/images/az-logo.png"
            alt="شعار الموقع"
            width={size === "lg" ? 60 : size === "md" ? 40 : 24}
            height={size === "lg" ? 60 : size === "md" ? 40 : 24}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
