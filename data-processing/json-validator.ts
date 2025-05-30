import type { JSONSchemaType, ValidateFunction, ValidationResult, ValidationError } from './types.js';

// Dynamic imports for dependencies to avoid build-time requirements
let Ajv: any = null;
let readFile: any = null;

async function getAjv() {
  if (!Ajv) {
    try {
      const ajvModule = await import('ajv');
      Ajv = ajvModule.default;
    } catch (error) {
      throw new Error(
        'AJV library not found. Please install ajv as a dependency.'
      );
    }
  }
  return Ajv;
}

async function getReadFile() {
  if (!readFile) {
    try {
      const fsModule = await import('fs/promises');
      readFile = fsModule.readFile;
    } catch (error) {
      throw new Error('fs/promises not available');
    }
  }
  return readFile;
}

// Global AJV instance with configuration  
let ajv: any = null;

async function getAjvInstance() {
  if (!ajv) {
    const AjvClass = await getAjv();
    ajv = new AjvClass({
      allErrors: true,        // Report all validation errors
      verbose: true,          // Include more detailed error information
      strict: false,          // Allow unknown keywords (for flexibility)
      removeAdditional: false // Don't remove additional properties
    });
  }
  return ajv;
}

/**
 * Load and compile a JSON schema from a file
 */
export async function loadSchema<T>(schemaPath: string): Promise<JSONSchemaType<T>> {
  try {
    const readFileFunc = await getReadFile();
    const schemaContent = await readFileFunc(schemaPath, 'utf-8');
    const schema = JSON.parse(schemaContent) as JSONSchemaType<T>;
    return schema;
  } catch (error) {
    throw new Error(`Failed to load schema from ${schemaPath}: ${error}`);
  }
}

/**
 * Create a validator function from a schema file
 */
export async function createValidator<T>(schemaPath: string): Promise<ValidateFunction<T>> {
  const schema = await loadSchema<T>(schemaPath);
  const ajvInstance = await getAjvInstance();
  return ajvInstance.compile(schema);
}

/**
 * Create a validator function from a schema object
 */
export async function createValidatorFromSchema<T>(schema: JSONSchemaType<T>): Promise<ValidateFunction<T>> {
  const ajvInstance = await getAjvInstance();
  return ajvInstance.compile(schema);
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
  
  const errors: ValidationError[] = (validator.errors || []).map(error => ({
    instancePath: error.instancePath,
    schemaPath: error.schemaPath,
    keyword: error.keyword,
    message: error.message || 'Validation error',
    data: error.data
  }));
  
  return {
    isValid: false,
    data: null,
    errors
  };
}

/**
 * Validate data against a schema file
 */
export async function validateDataWithSchema<T>(
  data: unknown,
  schemaPath: string
): Promise<ValidationResult<T>> {
  const validator = await createValidator<T>(schemaPath);
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
 * Create a reusable validator with caching
 */
export class SchemaValidator<T> {
  private validator: ValidateFunction<T> | null = null;
  
  constructor(private schemaPath: string) {}
  
  async validate(data: unknown): Promise<ValidationResult<T>> {
    if (!this.validator) {
      this.validator = await createValidator<T>(this.schemaPath);
    }
    
    return validateData(this.validator, data);
  }
  
  async validateArray(dataArray: unknown[]): Promise<ValidationResult<T[]>> {
    if (!this.validator) {
      this.validator = await createValidator<T>(this.schemaPath);
    }
    
    return validateDataArray(this.validator, dataArray);
  }
}
