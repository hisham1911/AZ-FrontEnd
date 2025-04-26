"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Award, User, Hash, FileText, Download, Printer, CheckCircle } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import QRCode from "react-qr-code"
import Image from "next/image"
import { searchService } from "@/lib/api-services"

export default function CertificateVerificationPage() {
  const params = useParams()
  const [certificate, setCertificate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [verificationStatus, setVerificationStatus] = useState("verified") // verified, expired, invalid

  useEffect(() => {
    const fetchCertificate = async () => {
      setLoading(true)

      try {
        // Call the API to search for a certificate by serial number
        console.log("Fetching certificate with ID:", params.id)
        const result = await searchService(params.id)

        if (result) {
          console.log("Certificate found:", result)
          // Transform the API response to match our frontend model
          setCertificate({
            id: `CERT-${result.id}`,
            name: result.name,
            title: result.method,
            serialNumber: result.s_N,
            issueDate: result.startDate,
            expiryDate: result.endDate,
            issuer: "AZ INTERNATIONAL",
            category: "Quality Management",
            status: new Date(result.endDate) > new Date() ? "active" : "expired",
            description: `${result.method} certification issued in ${result.location.country}`,
            additionalInfo: `Location: ${result.location.country}, ${result.location.state}, ${result.location.streetAddress}`,
            verificationUrl: `${window.location.origin}/certificates/${result.s_N}`,
            logoUrl: "/images/az-logo.png",
          })
          setVerificationStatus("verified")
        } else {
          setError("Certificate not found or has been revoked")
          setVerificationStatus("invalid")
        }
      } catch (err) {
        console.error("Error fetching certificate:", err)
        setError("Error fetching certificate data")
        setVerificationStatus("invalid")
      } finally {
        setLoading(false)
      }
    }

    fetchCertificate()
  }, [params.id])

  const handlePrint = () => {
    window.print()
  }

  const downloadQRCode = () => {
    const svg = document.getElementById("certificate-qr-code")
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")

      // Download PNG
      const downloadLink = document.createElement("a")
      downloadLink.download = `AZ-Certificate-${certificate.serialNumber}-QR.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Verifying certificate...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto border-t-4 border-red-500">
          <CardHeader>
            <CardTitle className="text-xl text-center">Certificate Verification Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
              <p>{error}</p>
            </div>
            <p className="mb-6">This certificate may be invalid, expired, or revoked.</p>
            <Button asChild>
              <a href="/certificates">Return to Certificate Search</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!certificate) return null

  return (
    <div className="container mx-auto px-4 py-12">
      <FadeIn>
        <div className="max-w-4xl mx-auto">
          {/* Verification Status Banner */}
          <div
            className={`mb-6 p-4 rounded-lg text-center ${
              verificationStatus === "verified"
                ? "bg-green-50 text-green-700"
                : verificationStatus === "expired"
                  ? "bg-orange-50 text-orange-700"
                  : "bg-red-50 text-red-700"
            }`}
          >
            {verificationStatus === "verified" && (
              <p className="flex items-center justify-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                This certificate has been verified and is authentic
              </p>
            )}
            {verificationStatus === "expired" && <p>This certificate is authentic but has expired</p>}
            {verificationStatus === "invalid" && <p>This certificate is invalid or has been revoked</p>}
          </div>

          <Card className="border-t-4 border-blue-600 hover:shadow-lg transition-all duration-300 print:shadow-none print:border">
            <CardHeader className="pb-2 flex flex-row items-center justify-between print:pb-0">
              <div className="flex items-center">
                <div className="relative h-12 w-24 mr-4">
                  <Image
                    src={certificate.logoUrl || "/placeholder.svg"}
                    alt="AZ International Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <CardTitle className="text-2xl">Certificate of Verification</CardTitle>
                  <p className="text-sm text-gray-500">AZ INTERNATIONAL Engineering & Technical Consulting</p>
                </div>
              </div>
              <div className="print:hidden">
                <Badge
                  className={`${
                    certificate.status === "active"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}
                >
                  {certificate.status === "active" ? "Active" : "Expired"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {/* Certificate Details - 2 columns */}
                <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Recipient Name</p>
                          <p className="font-medium">{certificate.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Hash className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Certificate ID</p>
                          <p className="font-medium">{certificate.serialNumber}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Certification</p>
                          <p className="font-medium">{certificate.title}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Issue Date</p>
                          <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Expiry Date</p>
                          <p className="font-medium">{new Date(certificate.expiryDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-medium">{certificate.category}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-gray-700">{certificate.description}</p>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-gray-500">Additional Information</p>
                    <p className="text-gray-700">{certificate.additionalInfo}</p>
                  </div>
                </div>

                {/* QR Code - 1 column */}
                <div className="flex flex-col items-center justify-center space-y-3 p-4 border rounded-lg bg-gray-50">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <QRCode
                      id="certificate-qr-code"
                      value={certificate.verificationUrl}
                      size={150}
                      level="H"
                      className="h-auto max-w-full"
                    />
                  </div>
                  <p className="text-sm text-center text-gray-600">Scan to verify certificate authenticity</p>
                  <div className="flex space-x-2 print:hidden">
                    <Button size="sm" variant="outline" onClick={downloadQRCode}>
                      <Download className="h-4 w-4 mr-1" />
                      QR Code
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 print:hidden">
                <Button variant="outline" asChild>
                  <a href="/certificates">Back to Search</a>
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                </div>
              </div>

              {/* Verification Footer */}
              <div className="border-t pt-4 mt-6 text-sm text-gray-500">
                <p>
                  This certificate can be verified online at:{" "}
                  <span className="font-medium">{certificate.verificationUrl}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>
    </div>
  )
}
