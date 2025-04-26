/**
 * خدمات API للشهادات
 *
 * هذا الملف يحتوي على دوال للتعامل مع بيانات الشهادات
 * يتصل بنقاط نهاية API الحقيقية لإدارة الشهادات
 */

// عنوان API الأساسي
const API_BASE_URL = "https://localhost:7246/api";

// وقت التخزين المؤقت - 5 دقائق
const CACHE_TTL = 5 * 60 * 1000;

// كائن للتخزين المؤقت
const cache = {
  data: new Map(),
  timestamps: new Map(),
  
  // حفظ البيانات في التخزين المؤقت
  set(key, data) {
    this.data.set(key, data);
    this.timestamps.set(key, Date.now());
    return data;
  },
  
  // الحصول على البيانات من التخزين المؤقت
  get(key) {
    const timestamp = this.timestamps.get(key);
    if (!timestamp) return null;
    
    // التحقق من صلاحية التخزين المؤقت
    const isExpired = Date.now() - timestamp > CACHE_TTL;
    if (isExpired) {
      this.data.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    
    return this.data.get(key);
  },
  
  // مسح التخزين المؤقت
  invalidate(keyPattern) {
    if (keyPattern instanceof RegExp) {
      // مسح المفاتيح التي تطابق النمط
      [...this.data.keys()].forEach(key => {
        if (keyPattern.test(key)) {
          this.data.delete(key);
          this.timestamps.delete(key);
        }
      });
    } else if (typeof keyPattern === 'string') {
      // مسح مفتاح محدد
      this.data.delete(keyPattern);
      this.timestamps.delete(keyPattern);
    } else {
      // مسح جميع المفاتيح
      this.data.clear();
      this.timestamps.clear();
    }
  }
};

/**
 * الحصول على جميع الشهادات
 * @returns {Promise<Array>} وعد يحتوي على مصفوفة من الشهادات
 */
export async function getAllServices() {
  const cacheKey = 'getAllServices';
  const cachedData = cache.get(cacheKey);
  
  // إذا وجدنا بيانات مخزنة مؤقتًا، نستخدمها
  if (cachedData) {
    console.log('استخدام بيانات مخزنة مؤقتًا للشهادات');
    return cachedData;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/Services`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`خطأ في الحصول على جميع الشهادات: ${response.status}`);
    }

    const data = await response.json();
    // تخزين البيانات مؤقتًا قبل إرجاعها
    return cache.set(cacheKey, data);
  } catch (error) {
    console.error('خطأ في الحصول على جميع الشهادات:', error);
    throw error;
  }
}

/**
 * البحث عن شهادة باستخدام الاسم
 * @param {string} search - نص البحث (اسم)
 * @returns {Promise<Array>} وعد يحتوي على مصفوفة من الشهادات المطابقة
 */
export async function searchServiceByName(search) {
  // استخدام البحث كمفتاح للتخزين المؤقت
  const cacheKey = `searchByName:${search}`;
  const cachedData = cache.get(cacheKey);
  
  // إذا وجدنا بيانات مخزنة مؤقتًا، نستخدمها
  if (cachedData) {
    console.log(`استخدام نتائج البحث المخزنة مؤقتًا للاسم: ${search}`);
    return cachedData;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/Services/searchByName?search=${encodeURIComponent(search)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // إضافة مهلة زمنية للطلب لتجنب التأخير الطويل
      signal: AbortSignal.timeout(5000) // إلغاء الطلب بعد 5 ثواني
    });

    if (!response.ok) {
      throw new Error(`خطأ في البحث عن الشهادة: ${response.status}`);
    }

    const data = await response.json();
    
    // التعامل مع هيكل البيانات الخاص بـ API
    let result = [];
    if (data && data.$values && Array.isArray(data.$values)) {
      result = data.$values;
    } else if (data && typeof data === 'object' && !Array.isArray(data)) {
      result = [data];
    } else {
      result = data || [];
    }
    
    // تخزين النتائج مؤقتًا
    return cache.set(cacheKey, result);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('انتهت مهلة البحث عن الشهادة بالاسم');
      return [];
    }
    console.error('خطأ في البحث عن الشهادة بالاسم:', error);
    throw error;
  }
}

/**
 * البحث عن شهادة باستخدام الرقم التسلسلي
 * @param {string} search - نص البحث (رقم تسلسلي)
 * @returns {Promise<Array>} وعد يحتوي على مصفوفة من الشهادات المطابقة
 */
export async function searchServiceBySerialNumber(search) {
  // استخدام البحث كمفتاح للتخزين المؤقت
  const cacheKey = `searchBySerial:${search}`;
  const cachedData = cache.get(cacheKey);
  
  // إذا وجدنا بيانات مخزنة مؤقتًا، نستخدمها
  if (cachedData) {
    console.log(`استخدام نتائج البحث المخزنة مؤقتًا للرقم التسلسلي: ${search}`);
    return cachedData;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/Services/searchByS_N?search=${encodeURIComponent(search)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // إضافة مهلة زمنية للطلب لتجنب التأخير الطويل
      signal: AbortSignal.timeout(5000) // إلغاء الطلب بعد 5 ثواني
    });

    if (!response.ok) {
      throw new Error(`خطأ في البحث عن الشهادة: ${response.status}`);
    }

    const data = await response.json();
    
    // التعامل مع هيكل البيانات الخاص بـ API
    let result = [];
    if (data && data.$values && Array.isArray(data.$values)) {
      result = data.$values;
    } else if (data && typeof data === 'object' && !Array.isArray(data)) {
      result = [data];
    } else {
      result = data || [];
    }
    
    // تخزين النتائج مؤقتًا
    return cache.set(cacheKey, result);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('انتهت مهلة البحث عن الشهادة بالرقم التسلسلي');
      return [];
    }
    console.error('خطأ في البحث عن الشهادة بالرقم التسلسلي:', error);
    throw error;
  }
}

/**
 * إنشاء شهادة جديدة
 * @param {Object} serviceData - بيانات الشهادة الجديدة
 * @returns {Promise<Object>} وعد يحتوي على الشهادة المنشأة
 */
export async function createService(serviceData) {
  try {
    const response = await fetch(`${API_BASE_URL}/Services/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      throw new Error(`خطأ في إنشاء الشهادة: ${response.status}`);
    }

    // إبطال مفعول التخزين المؤقت بعد الإنشاء
    cache.invalidate(/^(getAllServices|searchByName|searchBySerial)/);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('خطأ في إنشاء الشهادة:', error);
    throw error;
  }
}

/**
 * تحديث شهادة موجودة
 * @param {number} id - معرف الشهادة
 * @param {Object} serviceData - بيانات الشهادة المحدثة
 * @returns {Promise<Object>} وعد يحتوي على الشهادة المحدثة
 */
export async function updateService(id, serviceData) {
  try {
    const response = await fetch(`${API_BASE_URL}/Services/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      throw new Error(`خطأ في تحديث الشهادة: ${response.status}`);
    }

    // إبطال مفعول التخزين المؤقت بعد التحديث
    cache.invalidate(/^(getAllServices|searchByName|searchBySerial)/);
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`خطأ في تحديث الشهادة بالمعرف ${id}:`, error);
    throw error;
  }
}

/**
 * حذف شهادة
 * @param {number} id - معرف الشهادة
 * @returns {Promise<boolean>} وعد يحتوي على نتيجة الحذف
 */
export async function deleteService(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/Services/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`خطأ في حذف الشهادة: ${response.status}`);
    }
    
    // إبطال مفعول التخزين المؤقت بعد الحذف
    cache.invalidate(/^(getAllServices|searchByName|searchBySerial)/);

    return true;
  } catch (error) {
    console.error(`خطأ في حذف الشهادة بالمعرف ${id}:`, error);
    throw error;
  }
}
