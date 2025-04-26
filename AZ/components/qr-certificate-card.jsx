"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import QRCode from "react-qr-code"
import Image from "next/image"

export default function QRCertificateCard({ certificate, onPrint, onDownloadQR }) {
  if (!certificate) return null

  return (
    <Card className="max-w-sm mx-auto hover:shadow-md transition-all duration-300 overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center">
        <div className="relative h-12 w-24 mb-4">
          <Image
            src={certificate.logoUrl || "/placeholder.svg?height=80&width=160"}
            alt="AZ International Logo"
            fill
            className="object-contain"
          />
        </div>

        <h3 className="text-lg font-semibold mb-1">{certificate.title}</h3>
        <p className="text-sm text-gray-500 mb-4">Certificate #{certificate.serialNumber}</p>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border">
          <QRCode
            id={`qr-certificate-${certificate.serialNumber}`}
            value={certificate.verificationUrl}
            size={180}
            level="H"
            className="h-auto max-w-full"
          />
        </div>

        <p className="text-sm text-center text-gray-600 mb-4">
          Scan this QR code to verify the authenticity of this certificate
        </p>

        <p className="text-sm font-medium mb-1">{certificate.name}</p>
        <p className="text-xs text-gray-500 mb-4">
          Valid until {new Date(certificate.expiryDate).toLocaleDateString()}
        </p>

        <div className="flex space-x-2 w-full">
          <Button size="sm" variant="outline" className="flex-1" onClick={onDownloadQR}>
            <Download className="h-4 w-4 mr-1" />
            QR Code
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={onPrint}>
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
