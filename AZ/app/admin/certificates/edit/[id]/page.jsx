"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, Loader2, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { en } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/animations/fade-in";
import { updateService } from "@/lib/api-services";

import React from "react";

export default function EditCertificatePage({ params }) {
  const router = useRouter();
  const { toast } = useToast();

  // Use React.use to access parameters
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  // Extract ID number from CERT-{id} format
  const certificateId = id.startsWith("CERT-") ? id.substring(5) : id;

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    s_N: "",
    method: 1,
    startDate: "",
    endDate: "",
    location: {
      country: "",
      state: "",
      streetAddress: "",
    },
  });

  // Fetch certificate data on page load
  useEffect(() => {
    const fetchCertificateData = async () => {
      setIsLoading(true);
      try {
        // Use direct endpoint to get certificate data by ID
        const response = await fetch(
          `https://localhost:7246/api/Services/getById?id=${certificateId}`
        );

        if (response.ok) {
          const certificate = await response.json();
          console.log("Certificate data fetched:", certificate);

          // Set form data
          setFormData({
            name: certificate.name || "",
            s_N: certificate.s_N || "",
            method: certificate.method || 1,
            startDate: certificate.startDate
              ? new Date(certificate.startDate)
              : "",
            endDate: certificate.endDate ? new Date(certificate.endDate) : "",
            location: {
              country: certificate.location?.country || "",
              state: certificate.location?.state || "",
              streetAddress: certificate.location?.streetAddress || "",
            },
          });
        } else {
          toast({
            title: "Error",
            description: "Certificate not found",
            variant: "destructive",
          });
          router.push("/admin/certificates");
        }
      } catch (error) {
        console.error("Error fetching certificate data:", error);
        toast({
          title: "Error",
          description: "An error occurred while fetching certificate data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificateData();
  }, [certificateId, router, toast]);

  // Update form value
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      // Handle nested fields like location.country
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      // Handle regular fields
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Update date
  const handleDateChange = (date, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: date,
    });
  };

  // Update dropdown value
  const handleSelectChange = (value, fieldName) => {
    // Convert value to number if it's method
    const processedValue = fieldName === "method" ? parseInt(value, 10) : value;
    setFormData({
      ...formData,
      [fieldName]: processedValue,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      console.log("Form data being sent:", formData);

      // Prepare data for submission
      const updatedData = {
        id: parseInt(certificateId, 10), // Ensure ID is a number
        name: formData.name,
        s_N: formData.s_N,
        method: formData.method,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
      };

      // Call API to update certificate
      const result = await updateService(certificateId, updatedData);
      console.log("Certificate updated:", result);

      toast({
        title: "Updated",
        description: "Certificate has been successfully updated",
      });

      // Return to certificates page
      router.push("/admin/certificates");
    } catch (error) {
      console.error("Error updating certificate:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the certificate",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center gap-2 mb-6">
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
              Edit Certificate
            </h1>
            <p className="text-gray-500">
              Update the details of an existing certificate.
            </p>
          </div>
        </div>

        <Card className="shadow-sm">
          {isLoading ? (
            <CardContent className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              <p className="ml-2">Loading certificate data...</p>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle>Certificate Information</CardTitle>
                <CardDescription>
                  Make any necessary changes to the certificate details
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Recipient Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="s_N">Serial Number</Label>
                      <Input
                        id="s_N"
                        name="s_N"
                        placeholder="Enter serial number"
                        value={formData.s_N}
                        onChange={handleInputChange}
                        className="mt-1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="method">Certificate Type</Label>
                      <Select
                        value={formData.method.toString()}
                        onValueChange={(value) =>
                          handleSelectChange(value, "method")
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select certificate type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">ISO Certificate</SelectItem>
                          <SelectItem value="2">Certificate Type 2</SelectItem>
                          <SelectItem value="3">Certificate Type 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Issue Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full mt-1 justify-start text-left",
                              !formData.startDate && "text-gray-500"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.startDate
                              ? format(formData.startDate, "PPP", {
                                  locale: en,
                                })
                              : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.startDate}
                            onSelect={(date) =>
                              handleDateChange(date, "startDate")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Expiry Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full mt-1 justify-start text-left",
                              !formData.endDate && "text-gray-500"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.endDate
                              ? format(formData.endDate, "PPP", { locale: en })
                              : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.endDate}
                            onSelect={(date) =>
                              handleDateChange(date, "endDate")
                            }
                            initialFocus
                            disabled={(date) => date < formData.startDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">
                    Location Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="location.country">Country</Label>
                      <Input
                        id="location.country"
                        name="location.country"
                        placeholder="Enter country name"
                        value={formData.location.country}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="location.state">City</Label>
                      <Input
                        id="location.state"
                        name="location.state"
                        placeholder="Enter city name"
                        value={formData.location.state}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="location.streetAddress">Address</Label>
                      <Textarea
                        id="location.streetAddress"
                        name="location.streetAddress"
                        placeholder="Enter detailed address"
                        value={formData.location.streetAddress}
                        onChange={handleInputChange}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between border-t p-6 bg-gray-50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/certificates")}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </FadeIn>
    </div>
  );
}
