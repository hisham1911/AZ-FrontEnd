import { NextResponse } from "next/server"

// This would be replaced with a database query in a real application
const certificatesDatabase = [
  {
    id: "CERT-12345",
    name: "John Smith",
    title: "ISO 9001:2015",
    serialNumber: "12345",
    issueDate: "2023-05-15",
    expiryDate: "2025-05-14",
    issuer: "International Organization for Standardization",
    category: "Quality Management",
    status: "active",
    description: "Quality Management System Certification",
    additionalInfo: "All certification requirements successfully met",
  },
  {
    id: "CERT-67890",
    name: "Jane Doe",
    title: "API 653",
    serialNumber: "67890",
    issueDate: "2022-11-30",
    expiryDate: "2024-11-29",
    issuer: "American Petroleum Institute",
    category: "Inspection",
    status: "active",
    description: "Tank Inspection Certification",
    additionalInfo: "Specialized in storage tank inspection",
  },
]

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")
  const type = searchParams.get("type") // 'name' or 'serial'

  if (!query) {
    return NextResponse.json({ error: "Search query is required" }, { status: 400 })
  }

  // Add artificial delay to simulate network request
  await new Promise((resolve) => setTimeout(resolve, 1000))

  let results = []

  if (type === "serial") {
    results = certificatesDatabase.filter((cert) => cert.serialNumber.toLowerCase().includes(query.toLowerCase()))
  } else {
    // Default to name search
    results = certificatesDatabase.filter(
      (cert) =>
        cert.name.toLowerCase().includes(query.toLowerCase()) || cert.title.toLowerCase().includes(query.toLowerCase()),
    )
  }

  return NextResponse.json({ results })
}
