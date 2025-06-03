// Dynamic import for unidecode to avoid build-time dependency
let unidecode = null;
async function getUnidecode() {
    if (!unidecode) {
        try {
            const unidecodeModule = await import('unidecode');
            unidecode = unidecodeModule.default;
        }
        catch (error) {
            throw new Error('unidecode library not found. Please install unidecode as a dependency.');
        }
    }
    return unidecode;
}
/**
 * Transform date strings to Date objects in data structure
 */
export function transformDates(data, dateFields) {
    const transformed = { ...data };
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
export function transformDatesInArray(dataArray, dateFields) {
    return dataArray.map(item => transformDates(item, dateFields));
}
/**
 * Normalize Unicode strings using unidecode
 */
export function normalizeStrings(data, stringFields) {
    const normalized = { ...data };
    for (const field of stringFields) {
        if (field in normalized && typeof normalized[field] === 'string') {
            normalized[field] = unidecode(normalized[field]);
        }
    }
    return normalized;
}
/**
 * Normalize strings in array of objects
 */
export function normalizeStringsInArray(dataArray, stringFields) {
    return dataArray.map(item => normalizeStrings(item, stringFields));
}
/**
 * Deep transform nested object structures
 */
export function deepTransform(data, transformer, path = '') {
    if (Array.isArray(data)) {
        return data.map((item, index) => deepTransform(item, transformer, `${path}[${index}]`));
    }
    if (data && typeof data === 'object') {
        const transformed = {};
        for (const [key, value] of Object.entries(data)) {
            const currentPath = path ? `${path}.${key}` : key;
            const transformedValue = transformer(value, key, currentPath);
            if (transformedValue && typeof transformedValue === 'object') {
                transformed[key] = deepTransform(transformedValue, transformer, currentPath);
            }
            else {
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
export function transformData(data, options = {}) {
    const { dateFields = [], stringFields = [], normalizeUnicode = false, preserveOriginal = false } = options;
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
export function transformDataArray(dataArray, options = {}) {
    return dataArray.map(item => transformData(item, options));
}
/**
 * Extract unique values from an array of objects for a given field
 */
export function extractUniqueValues(dataArray, field) {
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
export function groupByField(dataArray, field) {
    const groups = {};
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
export function safeGet(obj, path, defaultValue) {
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key];
        }
        else {
            return defaultValue;
        }
    }
    return current ?? defaultValue;
}
//# sourceMappingURL=data-transformer.js.map