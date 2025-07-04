/**
 * Type definitions for data processing utilities
 */

/* Placeholder types for AJV when not available during build */
export interface ValidateFunction<T = any> {
  (data: any): data is T;
  errors?: ValidationError[] | null;
}

export interface JSONSchemaType<T = any> {
  type?: string;
  properties?: Record<string, any>;
  required?: string[];
  [key: string]: any;
}

/**
 * Result of data validation
 */
export interface ValidationResult<T> {
  isValid: boolean;
  data: T | null;
  errors: ValidationError[];
}

/**
 * Validation error details
 */
export interface ValidationError {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  message: string;
  data?: unknown;
}

/**
 * Data transformation options
 */
export interface TransformOptions {
  dateFields?: string[];
  stringFields?: string[];
  normalizeUnicode?: boolean;
  preserveOriginal?: boolean;
}

/**
 * Data processor configuration
 */
export interface ProcessorConfig {
  schemaPath?: string;
  cacheEnabled?: boolean;
  maxCacheSize?: number;
  validateOnLoad?: boolean;
}

// Types are defined above - no need to re-export from ajv
