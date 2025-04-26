"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CustomCalendar } from "@/components/ui/custom-calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, Save } from "lucide-react";
import { formatDate, addYears } from "@/utils/date-utils";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/animations/fade-in";
import { useToast } from "@/components/ui/use-toast";
import { createService } from "@/lib/api-services";

/**
 * Create New Certificate Page
 * Allows the user to enter certificate data and save it
 */
export default function CreateCertificatePage() {
  const router = useRouter();
  const { toast } = useToast();

  // Certificate creation form state
  const [formData, setFormData] = useState({
    title: "", // Certificate title
    recipientName: "", // Recipient name
    category: "", // Certificate category
    issueDate: new Date(), // Issue date (current day)
    expiryDate: addYears(new Date(), 2), // Expiry date (2 years from now)
    serialNumber: `CERT-${Math.floor(10000 + Math.random() * 90000)}`, // Random serial number
    description: "", // Certificate description
    additionalInfo: "", // Additional information
    status: "active", // Certificate status (active by default)
  });

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle text input field changes
   * @param {Event} e - Change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handle dropdown select changes
   * @param {string} name - Field name
   * @param {string} value - New value
   */
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handle date field changes
   * @param {string} name - Date field name
   * @param {Date} value - New date
   */
  const handleDateChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handle form submission
   * @param {Event} e - Submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Transform form data to match API model
      // Convert method to a number because API expects a number not text
      let methodValue = 1; // Default value if text can't be converted

      try {
        // Try to convert value to number
        if (formData.title) {
          if (!isNaN(formData.title)) {
            methodValue = parseInt(formData.title, 10);
          } else if (formData.title.toLowerCase().includes("iso")) {
            methodValue = 1; // Force value 1 for ISO certificates
          }
        }
      } catch (e) {
        console.warn("Failed to convert method value to number:", e);
      }

      const serviceData = {
        name: formData.recipientName,
        s_N: formData.serialNumber,
        method: methodValue, // Use numeric value
        startDate: formData.issueDate.toISOString(),
        endDate: formData.expiryDate.toISOString(),
        location: {
          country: "Egypt", // Default value or could add these fields to the form
          state: "Cairo",
          streetAddress: "33 Gamal El-Deen Kassem St., Nasr City",
        },
      };

      console.log("Creating certificate with data:", serviceData);
      // Call API to create certificate
      await createService(serviceData);

      // Show success message
      toast({
        title: "Certificate Created",
        description: "Certificate has been successfully created.",
      });

      // Navigate to certificates page
      router.push("/admin/certificates");
    } catch (error) {
      console.error("Error creating certificate:", error);
      // Show error message
      toast({
        title: "Error",
        description:
          "An error occurred while creating the certificate: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Create Certificate
            </h1>
            <p className="text-gray-500">
              Create a new certificate for a recipient.
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Certificate Details Card */}
            <Card className="shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle>Certificate Details</CardTitle>
                <CardDescription>
                  Enter the basic information for the certificate.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* Certificate Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Certificate Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Example: ISO 9001:2015"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Recipient Name */}
                <div className="space-y-2">
                  <Label htmlFor="recipientName">Recipient Name</Label>
                  <Input
                    id="recipientName"
                    name="recipientName"
                    placeholder="Full name of the recipient"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Certificate Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleSelectChange("category", value)
                    }
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quality Management">
                        Quality Management
                      </SelectItem>
                      <SelectItem value="Inspection">Inspection</SelectItem>
                      <SelectItem value="Welding">Welding</SelectItem>
                      <SelectItem value="Non-Destructive Testing">
                        Non-Destructive Testing
                      </SelectItem>
                      <SelectItem value="Environmental Management">
                        Environmental Management
                      </SelectItem>
                      <SelectItem value="Occupational Health & Safety">
                        Occupational Health & Safety
                      </SelectItem>
                      <SelectItem value="Piping Inspection">
                        Piping Inspection
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Serial Number */}
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Auto-generated. You can modify it if needed.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Dates and Status Card */}
            <Card className="shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle>Dates and Status</CardTitle>
                <CardDescription>
                  Set the certificate validity period and status.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* Issue Date */}
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.issueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.issueDate ? (
                          formatDate(formData.issueDate)
                        ) : (
                          <span>Select a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CustomCalendar
                        mode="single"
                        selected={formData.issueDate}
                        onSelect={(date) => handleDateChange("issueDate", date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Expiry Date */}
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.expiryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.expiryDate ? (
                          formatDate(formData.expiryDate)
                        ) : (
                          <span>Select a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CustomCalendar
                        mode="single"
                        selected={formData.expiryDate}
                        onSelect={(date) =>
                          handleDateChange("expiryDate", date)
                        }
                        disabled={(date) => date < formData.issueDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Certificate Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="revoked">Revoked</SelectItem>
                      <SelectItem value="expiring_soon">
                        Expiring Soon
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information Card */}
            <Card className="md:col-span-2 shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>
                  Provide any additional details about the certificate.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* Certificate Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Brief description of the certificate"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                {/* Additional Information */}
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    placeholder="Any additional information or notes"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-6">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Create Certificate
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </FadeIn>
    </div>
  );
}
