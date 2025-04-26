"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { FadeIn } from "@/components/animations/fade-in"
import { updateService } from "@/lib/api-services"

import React from "react"

export default function EditServicePage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  
  // استخدام React.use للوصول إلى المعلمات
  const resolvedParams = React.use(params)
  const id = resolvedParams.id

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    s_N: "",
    method: 1,
    startDate: "",
    endDate: "",
    location: {
      country: "",
      state: "",
      streetAddress: ""
    }
  })

  // جلب بيانات الخدمة عند تحميل الصفحة
  useEffect(() => {
    const fetchServiceData = async () => {
      setIsLoading(true)
      try {
        // استخدام الـ endpoint المقدم للحصول على بيانات الخدمة من خلال المعرف
        const response = await fetch(`https://localhost:7246/api/Services/getById?id=${id}`)
        
        if (response.ok) {
          const serviceData = await response.json()
          console.log("تم جلب بيانات الخدمة:", serviceData)
          
          // تعيين بيانات النموذج
          setFormData({
            name: serviceData.name || "",
            s_N: serviceData.s_N || "",
            method: serviceData.method || 1,
            startDate: serviceData.startDate ? new Date(serviceData.startDate) : "",
            endDate: serviceData.endDate ? new Date(serviceData.endDate) : "",
            location: {
              country: serviceData.location?.country || "",
              state: serviceData.location?.state || "",
              streetAddress: serviceData.location?.streetAddress || ""
            }
          })
        } else {
          toast({
            title: "خطأ",
            description: "لم يتم العثور على الخدمة",
            variant: "destructive",
          })
          router.push("/admin/services")
        }
      } catch (error) {
        console.error("خطأ في جلب بيانات الخدمة:", error)
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء جلب بيانات الخدمة",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchServiceData()
  }, [id, router, toast])

  // تحديث قيمة في النموذج
  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      // التعامل مع الحقول المتداخلة مثل location.country
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      })
    } else {
      // التعامل مع الحقول العادية
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  // تحديث التاريخ
  const handleDateChange = (date, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: date
    })
  }

  // تحديث القيمة المنسدلة
  const handleSelectChange = (value, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: parseInt(value, 10)
    })
  }

  // تقديم النموذج
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // تحضير البيانات للإرسال
      const submissionData = {
        id: parseInt(id, 10),
        name: formData.name,
        s_N: formData.s_N,
        method: formData.method,
        startDate: formData.startDate ? formData.startDate.toISOString() : null,
        endDate: formData.endDate ? formData.endDate.toISOString() : null,
        location: {
          id: parseInt(id, 10), // استخدام نفس معرف الخدمة للموقع
          country: formData.location.country,
          state: formData.location.state,
          streetAddress: formData.location.streetAddress
        }
      }

      // استخدام دالة updateService من api-services.js لتحديث الخدمة وإبطال مفعول التخزين المؤقت
      const result = await updateService(parseInt(id, 10), submissionData)
      
      if (result) {
        toast({
          title: "تم بنجاح",
          description: "تم تحديث الخدمة بنجاح",
          variant: "success",
        })
        router.push('/admin/services')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "فشل في تحديث الخدمة")
      }
    } catch (error) {
      console.error("خطأ في تحديث الخدمة:", error)
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تحديث الخدمة",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <FadeIn>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">تعديل الخدمة</CardTitle>
            <CardDescription>تعديل بيانات الخدمة الحالية</CardDescription>
          </CardHeader>
          
          {isLoading ? (
            <CardContent className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="mr-2">جاري تحميل البيانات...</span>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">اسم الخدمة</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="أدخل اسم الخدمة"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="s_N">الرقم التسلسلي</Label>
                    <Input
                      id="s_N"
                      name="s_N"
                      placeholder="أدخل الرقم التسلسلي للخدمة"
                      value={formData.s_N}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="method">طريقة التقديم</Label>
                    <Select
                      value={formData.method.toString()}
                      onValueChange={(value) => handleSelectChange(value, "method")}
                    >
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="اختر طريقة التقديم" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">طريقة 1</SelectItem>
                        <SelectItem value="2">طريقة 2</SelectItem>
                        <SelectItem value="3">طريقة 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">تاريخ البدء</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full mt-1 justify-start text-right",
                              !formData.startDate && "text-gray-500"
                            )}
                          >
                            <CalendarIcon className="ml-2 h-4 w-4" />
                            {formData.startDate ? (
                              format(formData.startDate, "PPP", { locale: ar })
                            ) : (
                              "اختر التاريخ"
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.startDate}
                            onSelect={(date) => handleDateChange(date, "startDate")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label htmlFor="endDate">تاريخ الانتهاء</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full mt-1 justify-start text-right",
                              !formData.endDate && "text-gray-500"
                            )}
                          >
                            <CalendarIcon className="ml-2 h-4 w-4" />
                            {formData.endDate ? (
                              format(formData.endDate, "PPP", { locale: ar })
                            ) : (
                              "اختر التاريخ"
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.endDate}
                            onSelect={(date) => handleDateChange(date, "endDate")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-2">بيانات الموقع</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="location.country">الدولة</Label>
                        <Input
                          id="location.country"
                          name="location.country"
                          placeholder="أدخل اسم الدولة"
                          value={formData.location.country}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="location.state">المدينة</Label>
                        <Input
                          id="location.state"
                          name="location.state"
                          placeholder="أدخل اسم المدينة"
                          value={formData.location.state}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="location.streetAddress">العنوان</Label>
                        <Textarea
                          id="location.streetAddress"
                          name="location.streetAddress"
                          placeholder="أدخل العنوان التفصيلي"
                          value={formData.location.streetAddress}
                          onChange={handleInputChange}
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/services")}
                >
                  إلغاء
                </Button>
                
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    "حفظ التغييرات"
                  )}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </FadeIn>
    </div>
  )
}
