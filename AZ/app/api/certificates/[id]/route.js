import { NextResponse } from "next/server"

// This would be replaced with a database query in a real application
const certificatesDatabase = {
  12345: {
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
    logoUrl: "/placeholder.svg?height=80&width=160",
  },
}

export async function GET(request, { params }) {
  // Add artificial delay to simulate network request
  await new Promise((resolve) => setTimeout(resolve, 500))

  const certificate = certificatesDatabase[params.id]

  if (!certificate) {
    return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
  }

  // Add the verification URL to the certificate data
  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`
  certificate.verificationUrl = `${baseUrl}/certificates/${certificate.serialNumber}`

  return NextResponse.json(certificate)
}
