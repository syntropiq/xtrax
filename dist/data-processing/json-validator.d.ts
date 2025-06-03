import type { JSONSchemaType, ValidateFunction, ValidationResult } from './types.js';
/**
 * Simple JSON validator that works without external dependencies
 * Note: This is a basic implementation. For production use with complex schemas,
 * consider using AJV in a Node.js environment.
 */
/**
 * Create a basic validator function from a schema object
 */
export declare function createValidatorFromSchema<T>(schema: JSONSchemaType<T>): ValidateFunction<T>;
/**
 * Validate data against a validator function
 */
export declare function validateData<T>(validator: ValidateFunction<T>, data: unknown): ValidationResult<T>;
/**
 * Validate data against a schema object
 */
export declare function validateDataWithSchema<T>(data: unknown, schema: JSONSchemaType<T>): ValidationResult<T>;
/**
 * Validate multiple data items against the same schema
 */
export declare function validateDataArray<T>(validator: ValidateFunction<T>, dataArray: unknown[]): ValidationResult<T[]>;
/**
 * Create a reusable validator with caching for a schema object
 */
export declare class SchemaValidator<T> {
    private schema;
    private validator;
    constructor(schema: JSONSchemaType<T>);
    validate(data: unknown): ValidationResult<T>;
    validateArray(dataArray: unknown[]): ValidationResult<T[]>;
}
//# sourceMappingURL=json-validator.d.ts.map