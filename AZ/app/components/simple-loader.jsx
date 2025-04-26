"use client";

export default function SimpleLoader() {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[9999] bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 animate-pulse">
      <div className="w-full h-full bg-blue-600 animate-[loader_2s_ease-in-out_infinite]"></div>
    </div>
  );
}

export function FullLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-[9999]">
      <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-blue-600 font-medium">جاري التحميل...</p>
    </div>
  );
}

export function ButtonSpinner({ className = "" }) {
  return (
    <svg className={`animate-spin -mr-1 h-5 w-5 text-white ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
