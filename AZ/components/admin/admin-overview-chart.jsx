"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function AdminOverviewChart() {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchData = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data for the chart
      const data = [
        { name: "Jan", certificates: 65 },
        { name: "Feb", certificates: 59 },
        { name: "Mar", certificates: 80 },
        { name: "Apr", certificates: 81 },
        { name: "May", certificates: 56 },
        { name: "Jun", certificates: 55 },
        { name: "Jul", certificates: 40 },
        { name: "Aug", certificates: 70 },
        { name: "Sep", certificates: 90 },
        { name: "Oct", certificates: 110 },
        { name: "Nov", certificates: 130 },
        { name: "Dec", certificates: 142 },
      ]

      setChartData(data)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "0.375rem",
            }}
          />
          <Bar dataKey="certificates" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
