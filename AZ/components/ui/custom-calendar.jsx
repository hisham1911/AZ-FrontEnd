"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { startOfMonth, endOfMonth, addMonths, isSameDay } from "@/utils/date-utils"

/**
 * مكون تقويم مخصص يحل محل مكتبة react-day-picker
 *
 * @param {Object} props - خصائص المكون
 * @param {Date} props.selected - التاريخ المحدد حالياً
 * @param {Function} props.onSelect - دالة تُستدعى عند اختيار تاريخ
 * @param {string} props.mode - وضع التحديد ('single' أو 'range' أو 'multiple')
 * @param {Function} props.disabled - دالة تحدد ما إذا كان التاريخ معطلاً
 * @param {string} props.className - فئات CSS إضافية
 */
export function CustomCalendar({ selected, onSelect, mode = "single", disabled, className }) {
  // الشهر الحالي المعروض في التقويم
  const [currentMonth, setCurrentMonth] = useState(selected || new Date())

  // تحديث الشهر الحالي عند تغيير التاريخ المحدد
  useEffect(() => {
    if (selected) {
      setCurrentMonth(new Date(selected))
    }
  }, [selected])

  // الانتقال إلى الشهر السابق
  const goToPreviousMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1))
  }

  // الانتقال إلى الشهر التالي
  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  // الحصول على أيام الشهر الحالي
  const getDaysInMonth = () => {
    const firstDay = startOfMonth(currentMonth)
    const lastDay = endOfMonth(currentMonth)
    const days = []

    // إضافة أيام فارغة في بداية الشهر (لمحاذاة اليوم الأول من الشهر مع اليوم المناسب في الأسبوع)
    const firstDayOfWeek = firstDay.getDay() // 0 = الأحد، 1 = الاثنين، إلخ
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // إضافة أيام الشهر
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      days.push(date)
    }

    return days
  }

  // التحقق مما إذا كان التاريخ معطلاً
  const isDateDisabled = (date) => {
    if (!date) return true
    if (disabled && typeof disabled === "function") {
      return disabled(date)
    }
    return false
  }

  // التحقق مما إذا كان التاريخ محدداً
  const isDateSelected = (date) => {
    if (!date || !selected) return false
    return isSameDay(date, selected)
  }

  // معالجة اختيار التاريخ
  const handleSelectDate = (date) => {
    if (isDateDisabled(date)) return
    onSelect(date)
  }

  // الحصول على أسماء أيام الأسبوع
  const weekDays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]

  // الحصول على اسم الشهر والسنة
  const monthYearString = currentMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  })

  // الحصول على أيام الشهر
  const daysInMonth = getDaysInMonth()

  return (
    <div className={cn("p-3", className)}>
      {/* عنوان التقويم مع أزرار التنقل */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={goToPreviousMonth} className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium">{monthYearString}</div>
        <Button variant="outline" size="icon" onClick={goToNextMonth} className="h-7 w-7">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* أيام الأسبوع */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="text-center text-xs font-medium text-gray-500 h-8 flex items-center justify-center"
          >
            {day.substring(0, 1)}
          </div>
        ))}
      </div>

      {/* أيام الشهر */}
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day, index) => (
          <div
            key={index}
            className={cn(
              "h-8 w-8 p-0 font-normal",
              !day && "text-gray-400 cursor-default",
              day && !isDateDisabled(day) && "cursor-pointer hover:bg-gray-100 rounded-md",
              isDateSelected(day) && "bg-blue-600 text-white hover:bg-blue-700 rounded-md",
              isDateDisabled(day) && "text-gray-300 cursor-not-allowed",
            )}
            onClick={() => day && handleSelectDate(day)}
          >
            <div className="flex h-full w-full items-center justify-center">{day ? day.getDate() : ""}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
