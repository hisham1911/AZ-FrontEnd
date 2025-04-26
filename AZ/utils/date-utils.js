/**
 * مجموعة من الوظائف المساعدة للتعامل مع التواريخ
 * هذا الملف يحل محل مكتبة date-fns
 */

/**
 * تنسيق التاريخ بصيغة معينة
 * @param {Date} date - كائن التاريخ المراد تنسيقه
 * @param {string} formatStr - صيغة التنسيق (مثل "PPP" للتاريخ الكامل)
 * @returns {string} - التاريخ المنسق كنص
 */
export function formatDate(date, formatStr = "PPP") {
  if (!date) return ""

  // التأكد من أن التاريخ هو كائن Date
  const dateObj = date instanceof Date ? date : new Date(date)

  // التحقق من صحة التاريخ
  if (isNaN(dateObj.getTime())) {
    console.error("تاريخ غير صالح:", date)
    return "تاريخ غير صالح"
  }

  // تنسيق التاريخ حسب الصيغة المطلوبة
  switch (formatStr) {
    case "PPP": // تنسيق كامل للتاريخ (مثل: 15 مارس، 2023)
      return dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    case "PP": // تنسيق متوسط للتاريخ (مثل: 15 مارس 2023)
      return dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    case "P": // تنسيق قصير للتاريخ (مثل: 15/03/2023)
      return dateObj.toLocaleDateString()
    case "p": // تنسيق الوقت (مثل: 14:30)
      return dateObj.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    case "Pp": // تنسيق التاريخ والوقت (مثل: 15/03/2023 14:30)
      return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    default:
      return dateObj.toLocaleDateString()
  }
}

/**
 * إضافة أيام إلى تاريخ معين
 * @param {Date} date - التاريخ الأصلي
 * @param {number} days - عدد الأيام المراد إضافتها
 * @returns {Date} - التاريخ الجديد بعد إضافة الأيام
 */
export function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * إضافة شهور إلى تاريخ معين
 * @param {Date} date - التاريخ الأصلي
 * @param {number} months - عدد الشهور المراد إضافتها
 * @returns {Date} - التاريخ الجديد بعد إضافة الشهور
 */
export function addMonths(date, months) {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

/**
 * إضافة سنوات إلى تاريخ معين
 * @param {Date} date - التاريخ الأصلي
 * @param {number} years - عدد السنوات المراد إضافتها
 * @returns {Date} - التاريخ الجديد بعد إضافة السنوات
 */
export function addYears(date, years) {
  const result = new Date(date)
  result.setFullYear(result.getFullYear() + years)
  return result
}

/**
 * مقارنة تاريخين لمعرفة إذا كانا متساويين (نفس اليوم)
 * @param {Date} date1 - التاريخ الأول
 * @param {Date} date2 - التاريخ الثاني
 * @returns {boolean} - true إذا كان التاريخان متساويين، false إذا كانا مختلفين
 */
export function isSameDay(date1, date2) {
  if (!date1 || !date2) return false

  const d1 = new Date(date1)
  const d2 = new Date(date2)

  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

/**
 * التحقق مما إذا كان التاريخ الأول قبل التاريخ الثاني
 * @param {Date} date1 - التاريخ الأول
 * @param {Date} date2 - التاريخ الثاني
 * @returns {boolean} - true إذا كان التاريخ الأول قبل التاريخ الثاني، false إذا لم يكن كذلك
 */
export function isBefore(date1, date2) {
  if (!date1 || !date2) return false

  return new Date(date1) < new Date(date2)
}

/**
 * التحقق مما إذا كان التاريخ الأول بعد التاريخ الثاني
 * @param {Date} date1 - التاريخ الأول
 * @param {Date} date2 - التاريخ الثاني
 * @returns {boolean} - true إذا كان التاريخ الأول بعد التاريخ الثاني، false إذا لم يكن كذلك
 */
export function isAfter(date1, date2) {
  if (!date1 || !date2) return false

  return new Date(date1) > new Date(date2)
}

/**
 * الحصول على أول يوم في الشهر
 * @param {Date} date - التاريخ المرجعي
 * @returns {Date} - أول يوم في الشهر
 */
export function startOfMonth(date) {
  const result = new Date(date)
  result.setDate(1)
  return result
}

/**
 * الحصول على آخر يوم في الشهر
 * @param {Date} date - التاريخ المرجعي
 * @returns {Date} - آخر يوم في الشهر
 */
export function endOfMonth(date) {
  const result = new Date(date)
  result.setMonth(result.getMonth() + 1)
  result.setDate(0)
  return result
}

/**
 * تنسيق التاريخ بصيغة مناسبة للعرض
 * @param {Date|string} date - التاريخ المراد تنسيقه
 * @returns {string} - التاريخ المنسق
 */
export function formatDateForDisplay(date) {
  if (!date) return ""

  const dateObj = typeof date === "string" ? new Date(date) : date

  // التحقق من صحة التاريخ
  if (isNaN(dateObj.getTime())) {
    return "تاريخ غير صالح"
  }

  return dateObj.toLocaleDateString()
}

/**
 * تنسيق التاريخ والوقت بصيغة مناسبة للعرض
 * @param {Date|string} date - التاريخ المراد تنسيقه
 * @returns {string} - التاريخ والوقت المنسقين
 */
export function formatDateTimeForDisplay(date) {
  if (!date) return ""

  const dateObj = typeof date === "string" ? new Date(date) : date

  // التحقق من صحة التاريخ
  if (isNaN(dateObj.getTime())) {
    return "تاريخ غير صالح"
  }

  return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })}`
}
