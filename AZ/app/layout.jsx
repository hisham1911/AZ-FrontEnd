import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AdminLink } from "@/components/admin/admin-link";
import { Suspense } from "react";
import Loading from "./loading";
import SpinnerLoader from "./components/spinner-loader";

// Optimize font loading
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // Use swap to prevent FOIT (Flash of Invisible Text)
});

export const metadata = {
  title: "AZ INTERNATIONAL - Engineering & Technical Consulting",
  description:
    "Engineering inspection, technical consultancy, and engineering training services",
  // Add cache control headers
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://azinternational.com"
  ),
  alternates: {
    canonical: "/",
  },
  generator: "v0.dev",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to domains for faster loading */}
        <link
          rel="preconnect"
          href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com"
        />

        {/* Preload critical assets */}
        <link
          rel="preload"
          href="/images/az-logo.png"
          as="image"
          type="image/png"
        />
      </head>
      <body className="font-sans">
        {/* لودر السبنر المركزي بالشعار لعرضه عند التنقل بين الصفحات */}
        <SpinnerLoader />

        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </main>
          <Footer />
          <AdminLink />
        </div>
      </body>
    </html>
  );
}
