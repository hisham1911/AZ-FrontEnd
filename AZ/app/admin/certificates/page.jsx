"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Download,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FadeIn } from "@/components/animations/fade-in";
import { useToast } from "@/components/ui/use-toast";
import {
  searchServiceByName,
  searchServiceBySerialNumber,
  deleteService,
} from "@/lib/api-services";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDateForDisplay } from "@/utils/date-utils";

/**
 * Certificate Management Page
 * Displays a list of all certificates and allows creating, editing, and deleting certificates
 */
export default function CertificatesPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Page states
  const [certificates, setCertificates] = useState([]); // Certificates list
  const [loading, setLoading] = useState(false); // Loading state - initially false
  const [searchQuery, setSearchQuery] = useState(""); // Search text
  const [selectedCertificates, setSelectedCertificates] = useState([]); // Selected certificates
  const [apiError, setApiError] = useState(null); // API error if any
  const [hasSearched, setHasSearched] = useState(false); // Track if user has searched

  /**
   * Function to fetch certificates based on search term
   */
  const fetchCertificates = async () => {
    setLoading(true);
    setApiError(null);
    setHasSearched(true);

    try {
      // Check if search value is empty
      const searchTerm = searchQuery.trim();

      // If no search, don't display any certificates
      if (!searchTerm) {
        console.log("No search query, no certificates will be displayed");
        setCertificates([]);
        setLoading(false);
        return;
      }

      console.log("Searching for certificates using:", searchTerm);

      // Call API for search
      let data = [];

      // Search by name
      try {
        const nameResults = await searchServiceByName(searchTerm);
        if (nameResults && nameResults.length > 0) {
          data = [...nameResults];
        }
      } catch (nameError) {
        console.error("Error searching by name:", nameError);
      }

      // If search is numeric, also search by serial number
      if (/\d/.test(searchTerm)) {
        try {
          const serialResults = await searchServiceBySerialNumber(searchTerm);
          if (serialResults && serialResults.length > 0) {
            // Add results that don't already exist (avoid duplicates)
            const existingIds = new Set(data.map((item) => item.id));
            serialResults.forEach((item) => {
              if (!existingIds.has(item.id)) {
                data.push(item);
              }
            });
          }
        } catch (serialError) {
          console.error("Error searching by serial number:", serialError);
        }
      }

      console.log("Received certificates:", data);

      if (!data || data.length === 0) {
        console.log("No certificates found");
        setCertificates([]);
        setLoading(false);
        return;
      }

      // Transform API data to UI model
      const transformedData = data.map((item) => ({
        id: `CERT-${item.id}`,
        name: item.name || "N/A",
        title:
          item.method === 1
            ? "ISO Certificate"
            : `Certificate Type ${item.method}`,
        serialNumber: item.s_N || "N/A",
        issueDate: item.startDate ? new Date(item.startDate) : new Date(),
        expiryDate: item.endDate
          ? new Date(item.endDate)
          : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        status:
          item.endDate && new Date(item.endDate) > new Date()
            ? "active"
            : "expired",
        category: "Quality Management",
      }));

      setCertificates(transformedData);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch certificates on page load
   */
  useEffect(() => {
    // We don't automatically search when first loading the page
  }, []);

  /**
   * Filter certificates based on search
   */
  const filteredCertificates = certificates.filter((cert) => {
    // Match with search
    const matchesSearch =
      searchQuery.trim() === "" ||
      cert.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.title?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  /**
   * Select/deselect all certificates
   * @param {boolean} checked - Selection state
   */
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCertificates(filteredCertificates.map((cert) => cert.id));
    } else {
      setSelectedCertificates([]);
    }
  };

  /**
   * Select/deselect one certificate
   * @param {string} id - Certificate ID
   * @param {boolean} checked - Selection state
   */
  const handleSelectCertificate = (id, checked) => {
    if (checked) {
      setSelectedCertificates([...selectedCertificates, id]);
    } else {
      setSelectedCertificates(
        selectedCertificates.filter((certId) => certId !== id)
      );
    }
  };

  /**
   * Navigate to create certificate page
   */
  const handleCreateCertificate = () => {
    router.push("/admin/certificates/create");
  };

  /**
   * Navigate to edit certificate page
   * @param {string} id - Certificate ID
   */
  const handleEditCertificate = (id) => {
    router.push(`/admin/certificates/edit/${id}`);
  };

  /**
   * Delete a single certificate
   * @param {string} id - Certificate ID
   */
  const handleDeleteCertificate = async (id) => {
    try {
      // Extract numeric ID from text (e.g., "CERT-123" -> 123)
      const numericId = id.split("-")[1];

      // Call API to delete certificate
      await deleteService(numericId);

      // Show success message
      toast({
        title: "Certificate Deleted",
        description: `Certificate ${id} has been successfully deleted.`,
      });

      // Remove certificate from state
      setCertificates(certificates.filter((cert) => cert.id !== id));
      setSelectedCertificates(
        selectedCertificates.filter((certId) => certId !== id)
      );
    } catch (error) {
      console.error("Error deleting certificate:", error);
      // Show error message
      toast({
        title: "Error",
        description: "Failed to delete certificate. Please try again.",
        variant: "destructive",
      });
    }
  };

  /**
   * Delete selected certificates
   */
  const handleBulkDelete = async () => {
    if (selectedCertificates.length === 0) return;

    try {
      // Delete each selected certificate
      for (const certId of selectedCertificates) {
        const numericId = certId.split("-")[1];
        await deleteService(numericId);
      }

      // Show success message
      toast({
        title: "Certificates Deleted",
        description: `${selectedCertificates.length} certificate(s) successfully deleted.`,
      });

      // Remove certificates from state
      setCertificates(
        certificates.filter((cert) => !selectedCertificates.includes(cert.id))
      );
      setSelectedCertificates([]);
    } catch (error) {
      console.error("Error deleting certificates:", error);
      // Show error message
      toast({
        title: "Error",
        description: "Failed to delete some certificates. Please try again.",
        variant: "destructive",
      });
    }
  };

  /**
   * Get appropriate status badge
   * @param {string} status - Certificate status
   * @returns {JSX.Element} - Status badge component
   */
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Active
          </Badge>
        );
      case "expired":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
          >
            <XCircle className="h-3 w-3" /> Expired
          </Badge>
        );
      case "revoked":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1"
          >
            <XCircle className="h-3 w-3" /> Revoked
          </Badge>
        );
      case "expiring_soon":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" /> Expiring Soon
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Certificates</h1>
            <p className="text-gray-500">
              Manage all certificates issued by AZ INTERNATIONAL.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreateCertificate}>
              <Plus className="h-4 w-4 mr-2" /> Create Certificate
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Display API error message if any */}
      {apiError && (
        <FadeIn>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>API Connection Error</AlertTitle>
            <AlertDescription>
              <p>
                Failed to connect to API. Please check if the backend server is
                running and accessible.
              </p>
              <p className="mt-2 text-xs">{apiError}</p>
            </AlertDescription>
          </Alert>
        </FadeIn>
      )}

      <FadeIn delay={100}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search field */}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <div className="flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search certificates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 min-w-[250px]"
                onKeyDown={(e) => e.key === "Enter" && fetchCertificates()}
              />
              <Button variant="secondary" onClick={fetchCertificates}>
                Search
              </Button>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={200}>
        <div className="bg-white rounded-md border shadow-sm">
          {/* Display loading indicator while fetching data */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div>
              {/* Display bulk actions bar when certificates are selected */}
              {selectedCertificates.length > 0 && (
                <div className="p-3 bg-blue-50 border-b flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    {selectedCertificates.length} certificate(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" /> Export Selected
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete Selected
                    </Button>
                  </div>
                </div>
              )}

              {/* Certificates table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          filteredCertificates.length > 0 &&
                          selectedCertificates.length ===
                            filteredCertificates.length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Certificate</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Display message when no certificates are found */}
                  {filteredCertificates.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-10 text-gray-500"
                      >
                        {hasSearched
                          ? searchQuery
                            ? "No certificates found matching your search criteria"
                            : "Please enter a search term to find certificates"
                          : "Use the search box above to find certificates"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    /* Display certificates */
                    filteredCertificates.map((cert) => (
                      <TableRow key={cert.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Checkbox
                            checked={selectedCertificates.includes(cert.id)}
                            onCheckedChange={(checked) =>
                              handleSelectCertificate(cert.id, checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">{cert.title}</p>
                              <p className="text-xs text-gray-500">
                                {cert.category}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{cert.name}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {cert.serialNumber}
                        </TableCell>
                        <TableCell>
                          {formatDateForDisplay(cert.issueDate)}
                        </TableCell>
                        <TableCell>
                          {formatDateForDisplay(cert.expiryDate)}
                        </TableCell>
                        <TableCell>{getStatusBadge(cert.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditCertificate(cert.id)}
                              >
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  window.open(
                                    `/certificates/${cert.serialNumber}`,
                                    "_blank"
                                  )
                                }
                              >
                                <Download className="h-4 w-4 mr-2" /> View
                                Certificate
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteCertificate(cert.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
