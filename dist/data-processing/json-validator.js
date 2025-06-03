/**
 * Simple JSON validator that works without external dependencies
 * Note: This is a basic implementation. For production use with complex schemas,
 * consider using AJV in a Node.js environment.
 */
/**
 * Create a basic validator function from a schema object
 */
export function createValidatorFromSchema(schema) {
    return (data) => {
        // Basic validation - just check if it's an object for now
        // This is a placeholder implementation
        return typeof data === 'object' && data !== null;
    };
}
/**
 * Validate data against a validator function
 */
export function validateData(validator, data) {
    const isValid = validator(data);
    if (isValid) {
        return {
            isValid: true,
            data: data,
            errors: []
        };
    }
    const errors = [{
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
export function validateDataWithSchema(data, schema) {
    const validator = createValidatorFromSchema(schema);
    return validateData(validator, data);
}
/**
 * Validate multiple data items against the same schema
 */
export function validateDataArray(validator, dataArray) {
    const validatedItems = [];
    const allErrors = [];
    for (let i = 0; i < dataArray.length; i++) {
        const result = validateData(validator, dataArray[i]);
        if (result.isValid && result.data) {
            validatedItems.push(result.data);
        }
        else {
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
export class SchemaValidator {
    schema;
    validator;
    constructor(schema) {
        this.schema = schema;
        this.validator = createValidatorFromSchema(schema);
    }
    validate(data) {
        return validateData(this.validator, data);
    }
    validateArray(dataArray) {
        return validateDataArray(this.validator, dataArray);
    }
}
//# sourceMappingURL=json-validator.js.map