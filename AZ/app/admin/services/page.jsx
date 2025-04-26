"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Search, PlusIcon, EditIcon, TrashIcon, 
  Loader2, InfoIcon, ArrowUpDown
} from "lucide-react"

// UI components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FadeIn } from "@/components/animations/fade-in"
import { useToast } from "@/components/ui/use-toast"

// API services
import { deleteService } from "@/lib/api-services"

// Utils
import { format } from "date-fns"


export default function ServicesPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  // Page states
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)

  // Function to search for services
  const searchServices = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    
    setIsSearching(true)
    setError(null)

    try {
      // Search by name
      const nameResponse = await fetch(`https://localhost:7246/api/Services/searchByName?search=${encodeURIComponent(query)}`)
      let results = []
      
      if (nameResponse.ok) {
        const nameData = await nameResponse.json()
        if (nameData && nameData.$values) {
          results = [...nameData.$values]
        }
      }
      
      // If the query contains numbers, also search by serial number
      if (/\d/.test(query)) {
        const serialResponse = await fetch(`https://localhost:7246/api/Services/searchByS_N?search=${encodeURIComponent(query)}`)
        
        if (serialResponse.ok) {
          const serialData = await serialResponse.json()
          if (serialData && serialData.$values) {
            // Add results that aren't already in the results array
            const existingIds = new Set(results.map(item => item.id))
            serialData.$values.forEach(item => {
              if (!existingIds.has(item.id)) {
                results.push(item)
              }
            })
          }
        }
      }
      
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching services:', error)
      setError('Failed to search services. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault()
    searchServices(searchQuery)
  }
  
  // Handle search input changes
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value)
  }
  
  // Handle service deletion
  const handleDeleteService = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id)
        toast({
          title: 'Success',
          description: 'Service deleted successfully',
          variant: 'success',
        })
        
        // Remove the deleted service from search results
        setSearchResults(prev => prev.filter(service => service.id !== id))
      } catch (error) {
        console.error('Error deleting service:', error)
        toast({
          title: 'Error',
          description: 'Failed to delete service',
          variant: 'destructive',
        })
      }
    }
  }

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return format(date, 'MMM dd, yyyy')
  }

  // Get method name based on method ID
  const getMethodName = (methodId) => {
    const methods = {
      1: 'Method 1',
      2: 'Method 2',
      3: 'Method 3'
    }
    return methods[methodId] || `Method ${methodId}`
  }
  
  // Get location string
  const getLocationString = (location) => {
    if (!location) return 'Not specified'
    
    const parts = []
    if (location.country) parts.push(location.country)
    if (location.state) parts.push(location.state)
    
    return parts.length > 0 ? parts.join(', ') : 'Not specified'
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <FadeIn>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Services Management</h1>
            <p className="text-muted-foreground mt-1">Search, view, edit and manage services</p>
          </div>
          <Button asChild>
            <Link href="/admin/services/add">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add New Service
            </Link>
          </Button>
        </div>
      
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Search Services</CardTitle>
            <CardDescription>
              Search for services by name or serial number to manage them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search by name or serial number..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    'Search'
                  )}
                </Button>
              </div>
            
              <Alert variant="info" className="bg-blue-50 text-blue-800 border-blue-200">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Search Tip</AlertTitle>
                <AlertDescription>
                  You can search services by name or serial number. Press Enter or click the Search button to perform the search.
                </AlertDescription>
              </Alert>
            </form>
          </CardContent>
        </Card>
      
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              {searchResults.length === 0 
                ? "No services found. Try searching for a service above." 
                : `Showing ${searchResults.length} service(s)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSearching ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Searching...</span>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto opacity-20 mb-2" />
                <p>No services found matching your search criteria</p>
                <p className="text-sm">Try searching by name or serial number</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Serial Number</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell>{service.s_N || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getMethodName(service.method)}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(service.startDate)}</TableCell>
                        <TableCell>{formatDate(service.endDate)}</TableCell>
                        <TableCell>{getLocationString(service.location)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" asChild>
                              <Link href={`/admin/services/edit?id=${service.id}`}>
                                <EditIcon className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          {searchResults.length > 0 && (
            <CardFooter className="flex justify-between border-t bg-muted/50 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {searchResults.length} service(s)
              </div>
            </CardFooter>
          )}
        </Card>
      </FadeIn>
    </div>
  )
}
