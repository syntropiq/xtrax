// Dynamic import for unidecode to avoid build-time dependency
let unidecode: any = null;

async function getUnidecode() {
  if (!unidecode) {
    try {
      const unidecodeModule = await import('unidecode');
      unidecode = unidecodeModule.default;
    } catch (error) {
      throw new Error(
        'unidecode library not found. Please install unidecode as a dependency.'
      );
    }
  }
  return unidecode;
}

import type { TransformOptions } from './types.js';

/**
 * Transform date strings to Date objects in data structure
 */
export function transformDates<T extends Record<string, any>>(
  data: T,
  dateFields: string[]
): T {
  const transformed = { ...data } as any;
  
  for (const field of dateFields) {
    if (field in transformed && typeof transformed[field] === 'string') {
      const dateValue = transformed[field];
      if (dateValue && dateValue !== '') {
        const parsedDate = new Date(dateValue);
        // Check if the date is valid (not NaN)
        if (!isNaN(parsedDate.getTime())) {
          transformed[field] = parsedDate;
        }
        // If invalid, keep the original string value unchanged
      }
    }
  }
  
  return transformed;
}

/**
 * Transform arrays of objects with date fields
 */
export function transformDatesInArray<T extends Record<string, any>>(
  dataArray: T[],
  dateFields: string[]
): T[] {
  return dataArray.map(item => transformDates(item, dateFields));
}

/**
 * Normalize Unicode strings using unidecode
 */
export function normalizeStrings<T extends Record<string, any>>(
  data: T,
  stringFields: string[]
): T {
  const normalized = { ...data };
  
  for (const field of stringFields) {
    if (field in normalized && typeof normalized[field] === 'string') {
      (normalized as any)[field] = unidecode((normalized as any)[field]);
    }
  }
  
  return normalized;
}

/**
 * Normalize strings in array of objects
 */
export function normalizeStringsInArray<T extends Record<string, any>>(
  dataArray: T[],
  stringFields: string[]
): T[] {
  return dataArray.map(item => normalizeStrings(item, stringFields));
}

/**
 * Deep transform nested object structures
 */
export function deepTransform<T>(
  data: T,
  transformer: (value: any, key: string, path: string) => any,
  path = ''
): T {
  if (Array.isArray(data)) {
    return data.map((item, index) => 
      deepTransform(item, transformer, `${path}[${index}]`)
    ) as unknown as T;
  }
  
  if (data && typeof data === 'object') {
    const transformed: any = {};
    
    for (const [key, value] of Object.entries(data)) {
      const currentPath = path ? `${path}.${key}` : key;
      const transformedValue = transformer(value, key, currentPath);
      
      if (transformedValue && typeof transformedValue === 'object') {
        transformed[key] = deepTransform(transformedValue, transformer, currentPath);
      } else {
        transformed[key] = transformedValue;
      }
    }
    
    return transformed;
  }
  
  return data;
}

/**
 * Comprehensive data transformation with multiple options
 */
export function transformData<T extends Record<string, any>>(
  data: T,
  options: TransformOptions = {}
): T {
  const {
    dateFields = [],
    stringFields = [],
    normalizeUnicode = false,
    preserveOriginal = false
  } = options;
  
  let transformed = preserveOriginal ? { ...data } : data;
  
  // Transform date fields
  if (dateFields.length > 0) {
    transformed = transformDates(transformed, dateFields);
  }
  
  // Normalize string fields
  if (normalizeUnicode && stringFields.length > 0) {
    transformed = normalizeStrings(transformed, stringFields);
  }
  
  return transformed;
}

/**
 * Transform array of data with options
 */
export function transformDataArray<T extends Record<string, any>>(
  dataArray: T[],
  options: TransformOptions = {}
): T[] {
  return dataArray.map(item => transformData(item, options));
}

/**
 * Extract unique values from an array of objects for a given field
 */
export function extractUniqueValues<T extends Record<string, any>>(
  dataArray: T[],
  field: string
): unknown[] {
  const values = new Set();
  
  for (const item of dataArray) {
    if (field in item && item[field] != null) {
      values.add(item[field]);
    }
  }
  
  return Array.from(values);
}

/**
 * Group array of objects by a field value
 */
export function groupByField<T extends Record<string, any>>(
  dataArray: T[],
  field: string
): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  
  for (const item of dataArray) {
    const key = String(item[field] || 'undefined');
    
    if (!groups[key]) {
      groups[key] = [];
    }
    
    groups[key].push(item);
  }
  
  return groups;
}

/**
 * Safe property access with default value
 */
export function safeGet<T>(
  obj: any,
  path: string,
  defaultValue: T
): T {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return defaultValue;
    }
  }
  
  return current ?? defaultValue;
}
