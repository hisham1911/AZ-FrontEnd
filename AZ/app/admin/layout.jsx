"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

// Admin components
import { FileCheck, LogOut, FileText } from "lucide-react"
import Link from "next/link"

// Admin sidebar component
function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    // Using window.location instead of router.push for a full reload
    window.location.href = "/admin/login"
  }

  const menuItems = [
    { 
      name: "Certificates", 
      href: "/admin/certificates", 
      icon: <FileText className="h-5 w-5" /> 
    }
  ]

  return (
    <div className="hidden border-r bg-gray-50/40 md:block md:w-64">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => {
              const isActive = pathname.includes(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center rounded-md px-3 py-2 text-sm ${isActive 
                      ? "bg-blue-100 text-blue-600" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              )
            })}
            <li className="mt-8">
              <button
                onClick={handleLogout}
                className="flex w-full items-center rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Log Out</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

// Header component
function AdminHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-white px-4">
      <div className="flex flex-1 items-center gap-4">
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      </div>
    </header>
  )
}

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      // Simulate verification delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Check for login data in localStorage
      const isAdmin = localStorage.getItem("adminAuthenticated") === "true"
      setIsAuthenticated(isAdmin)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [isLoading, isAuthenticated, pathname, router])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Loading admin panel...</span>
      </div>
    )
  }

  // If on the login page
  if (pathname === "/admin/login") {
    return children
  }
  
  // If not authenticated and not on login page
  if (!isAuthenticated && pathname !== "/admin/login") {
    return null; // Will be redirected by useEffect
  }

  // If authenticated, display the full admin dashboard
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}
