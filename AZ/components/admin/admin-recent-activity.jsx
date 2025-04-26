"use client"

import { useEffect, useState } from "react"
import { Award, User, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function AdminRecentActivity() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchActivities = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1200))

      // Mock data for recent activities
      const data = [
        {
          id: 1,
          type: "certificate_issued",
          title: "Certificate Issued",
          description: "ISO 9001:2015 certificate issued to Ahmed Hassan",
          timestamp: "2 hours ago",
          icon: Award,
          iconColor: "text-green-600",
          iconBgColor: "bg-green-100",
        },
        {
          id: 2,
          type: "user_created",
          title: "New User",
          description: "Sara Ahmed created a new account",
          timestamp: "5 hours ago",
          icon: User,
          iconColor: "text-blue-600",
          iconBgColor: "bg-blue-100",
        },
        {
          id: 3,
          type: "template_updated",
          title: "Template Updated",
          description: "API 653 certificate template was updated",
          timestamp: "Yesterday",
          icon: FileText,
          iconColor: "text-purple-600",
          iconBgColor: "bg-purple-100",
        },
        {
          id: 4,
          type: "certificate_expired",
          title: "Certificate Expired",
          description: "ASME certificate for Cairo Steel expired",
          timestamp: "2 days ago",
          icon: AlertCircle,
          iconColor: "text-red-600",
          iconBgColor: "bg-red-100",
        },
        {
          id: 5,
          type: "certificate_verified",
          title: "Certificate Verified",
          description: "NDT Level II certificate was verified",
          timestamp: "3 days ago",
          icon: CheckCircle,
          iconColor: "text-green-600",
          iconBgColor: "bg-green-100",
        },
      ]

      setActivities(data)
      setLoading(false)
    }

    fetchActivities()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className={cn("p-2 rounded-full", activity.iconBgColor)}>
            <activity.icon className={cn("h-4 w-4", activity.iconColor)} />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">{activity.title}</p>
            <p className="text-xs text-gray-500">{activity.description}</p>
            <p className="text-xs text-gray-400">{activity.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
