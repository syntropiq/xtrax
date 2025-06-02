import { describe, it, expect } from 'vitest';
import {
  createValidatorFromSchema,
  validateData,
  validateDataWithSchema,
  validateDataArray,
  SchemaValidator
} from '../data-processing/json-validator';

// Mock schema for testing
const testSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' },
    email: { type: 'string', format: 'email' }
  },
  required: ['name', 'email']
};

// Mock data for testing
const validData = { name: 'John Doe', age: 30, email: 'john@example.com' };
const invalidData = { name: 'Jane Doe', age: '30', email: 'not-an-email' };

describe('JSON Validator Tests', () => {
  it('should create a validator from a schema object', () => {
    const validator = createValidatorFromSchema(testSchema);
    expect(validator).toBeDefined();
    expect(typeof validator).toBe('function');
  });

  it('should validate data against a validator', () => {
    const validator = createValidatorFromSchema(testSchema);
    const result = validateData(validator, validData);

    expect(result.isValid).toBe(true);
    expect(result.data).toEqual(validData);
    expect(result.errors).toHaveLength(0);
  });

  it('should return validation errors for invalid data', () => {
    const validator = createValidatorFromSchema(testSchema);
    const result = validateData(validator, null); // null will fail the basic object check

    expect(result.isValid).toBe(false);
    expect(result.data).toBeNull();
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should validate data against a schema object', () => {
    const result = validateDataWithSchema(validData, testSchema);

    expect(result.isValid).toBe(true);
    expect(result.data).toEqual(validData);
    expect(result.errors).toHaveLength(0);
  });

  it('should return validation errors for invalid data with schema object', () => {
    const result = validateDataWithSchema(null, testSchema);

    expect(result.isValid).toBe(false);
    expect(result.data).toBeNull();
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should validate multiple data items against the same schema', () => {
    const validator = createValidatorFromSchema(testSchema);
    const dataArray = [validData, null]; // null will fail validation

    const result = validateDataArray(validator, dataArray);

    expect(result.isValid).toBe(false);
    expect(result.data).toBeNull();
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some(e => e.instancePath.startsWith('[1]'))).toBe(true);
  });

  it('should validate only valid items in array', () => {
    const validator = createValidatorFromSchema(testSchema);
    const dataArray = [validData, validData];

    const result = validateDataArray(validator, dataArray);

    expect(result.isValid).toBe(true);
    expect(result.data).toEqual([validData, validData]);
    expect(result.errors).toHaveLength(0);
  });

  it('should create a reusable validator with caching', () => {
    const validator = new SchemaValidator(testSchema);

    const result1 = validator.validate(validData);
    expect(result1.isValid).toBe(true);

    // Second validation should use cache
    const result2 = validator.validate(validData);
    expect(result2.isValid).toBe(true);
  });

  it('should validate multiple data items with SchemaValidator', () => {
    const validator = new SchemaValidator(testSchema);

    const result = validator.validateArray([validData, null]);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});