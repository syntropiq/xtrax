import type { TransformOptions } from './types.js';
/**
 * Transform date strings to Date objects in data structure
 */
export declare function transformDates<T extends Record<string, any>>(data: T, dateFields: string[]): T;
/**
 * Transform arrays of objects with date fields
 */
export declare function transformDatesInArray<T extends Record<string, any>>(dataArray: T[], dateFields: string[]): T[];
/**
 * Normalize Unicode strings using unidecode
 */
export declare function normalizeStrings<T extends Record<string, any>>(data: T, stringFields: string[]): T;
/**
 * Normalize strings in array of objects
 */
export declare function normalizeStringsInArray<T extends Record<string, any>>(dataArray: T[], stringFields: string[]): T[];
/**
 * Deep transform nested object structures
 */
export declare function deepTransform<T>(data: T, transformer: (value: any, key: string, path: string) => any, path?: string): T;
/**
 * Comprehensive data transformation with multiple options
 */
export declare function transformData<T extends Record<string, any>>(data: T, options?: TransformOptions): T;
/**
 * Transform array of data with options
 */
export declare function transformDataArray<T extends Record<string, any>>(dataArray: T[], options?: TransformOptions): T[];
/**
 * Extract unique values from an array of objects for a given field
 */
export declare function extractUniqueValues<T extends Record<string, any>>(dataArray: T[], field: string): unknown[];
/**
 * Group array of objects by a field value
 */
export declare function groupByField<T extends Record<string, any>>(dataArray: T[], field: string): Record<string, T[]>;
/**
 * Safe property access with default value
 */
export declare function safeGet<T>(obj: any, path: string, defaultValue: T): T;
//# sourceMappingURL=data-transformer.d.ts.map