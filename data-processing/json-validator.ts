import type { JSONSchemaType, ValidateFunction, ValidationResult, ValidationError } from './types.js';

/**
 * Simple JSON validator that works without external dependencies
 * Note: This is a basic implementation. For production use with complex schemas,
 * consider using AJV in a Node.js environment.
 */

/**
 * Create a basic validator function from a schema object
 */
export function createValidatorFromSchema<T>(schema: JSONSchemaType<T>): ValidateFunction<T> {
  return (data: unknown): data is T => {
    // Basic validation - just check if it's an object for now
    // This is a placeholder implementation
    return typeof data === 'object' && data !== null;
  };
}

/**
 * Validate data against a validator function
 */
export function validateData<T>(
  validator: ValidateFunction<T>,
  data: unknown
): ValidationResult<T> {
  const isValid = validator(data);

  if (isValid) {
    return {
      isValid: true,
      data: data as T,
      errors: []
    };
  }

  const errors: ValidationError[] = [{
    instancePath: '',
    schemaPath: '',
    keyword: 'type',
    message: 'Data validation failed',
    data: data
  }];

  return {
    isValid: false,
    data: null,
    errors
  };
}

/**
 * Validate data against a schema object
 */
export function validateDataWithSchema<T>(
  data: unknown,
  schema: JSONSchemaType<T>
): ValidationResult<T> {
  const validator = createValidatorFromSchema<T>(schema);
  return validateData(validator, data);
}

/**
 * Validate multiple data items against the same schema
 */
export function validateDataArray<T>(
  validator: ValidateFunction<T>,
  dataArray: unknown[]
): ValidationResult<T[]> {
  const validatedItems: T[] = [];
  const allErrors: ValidationError[] = [];

  for (let i = 0; i < dataArray.length; i++) {
    const result = validateData(validator, dataArray[i]);

    if (result.isValid && result.data) {
      validatedItems.push(result.data);
    } else {
      // Prefix errors with array index
      const indexedErrors = result.errors.map(error => ({
        ...error,
        instancePath: `[${i}]${error.instancePath}`
      }));
      allErrors.push(...indexedErrors);
    }
  }

  if (allErrors.length === 0) {
    return {
      isValid: true,
      data: validatedItems,
      errors: []
    };
  }

  return {
    isValid: false,
    data: null,
    errors: allErrors
  };
}

/**
 * Create a reusable validator with caching for a schema object
 */
export class SchemaValidator<T> {
  private validator: ValidateFunction<T>;

  constructor(private schema: JSONSchemaType<T>) {
    this.validator = createValidatorFromSchema<T>(schema);
  }

  validate(data: unknown): ValidationResult<T> {
    return validateData(this.validator, data);
  }

  validateArray(dataArray: unknown[]): ValidationResult<T[]> {
    return validateDataArray(this.validator, dataArray);
  }
}
