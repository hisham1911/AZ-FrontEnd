"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LockKeyhole } from "lucide-react"

export function AdminLink() {
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button asChild variant="outline" className="bg-white shadow-md">
        <Link href="/admin/login">
          <LockKeyhole className="mr-2 h-4 w-4" />
          Admin Dashboard
        </Link>
      </Button>
    </div>
  )
}
