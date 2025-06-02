# Data Processing Pipeline

Utilities for loading, validating, and transforming JSON data with type safety and error handling.

## Features

- **JSON Schema Validation**: AJV-based validation with detailed error reporting
- **Data Transformation**: Utilities for processing legal data structures
- **Type Safety**: Full TypeScript support with generic validation
- **Performance**: Efficient data loading and caching strategies
- **Error Handling**: Comprehensive error handling and recovery 

## Files

- `json-validator.ts` - JSON schema validation utilities
- `data-transformer.ts` - Data transformation utilities
- `types.ts` - TypeScript type definitions
- `README.md` - This documentation

## Usage

### JSON Validation
```typescript
import { createValidator, validateData } from './json-validator.js';

// Create a validator for your schema
const validator = await createValidator('court-schema.json');

// Validate data
const result = validateData(validator, someData);
if (result.isValid) {
  console.log('Data is valid!');
} else {
  console.error('Validation errors:', result.errors);
}
```

### File Loading
```typescript
import { loadJSONFile, loadDataWithSchema } from './file-loader.js';

// Load and validate JSON file
const courts = await loadDataWithSchema<CourtData[]>(
  'courts.json',
  'court-schema.json'
);

// Load raw JSON
const rawData = await loadJSONFile('variables.json');
```

### Data Transformation
```typescript
import { transformDates, normalizeStrings } from './data-transformer.js';

// Transform date strings to Date objects
const dataWithDates = transformDates(rawData, ['start', 'end']);

// Normalize Unicode strings
const normalizedData = normalizeStrings(data, ['name', 'examples']);
```

## Key Features

### Schema Validation
- Supports JSON Schema Draft 2020-12
- Detailed error reporting with paths
- Custom validation rules
- Performance optimized validation

### File Loading
- Async file operations
- Error handling for missing files
- Automatic JSON parsing
- Combined loading + validation

### Data Transformation
- Date string to Date object conversion
- Unicode normalization with unidecode
- Array processing utilities
- Safe property access

### Error Handling
- Structured error types
- Validation error aggregation
- File loading error recovery
- Graceful degradation

## Dependencies

- `ajv` - JSON schema validation
- `unidecode` - Unicode normalization
- `fs/promises` - Node.js file system (async)

## Performance Notes

- Validators are compiled once and reused
- File loading includes caching strategies
- Large datasets handled efficiently
- Memory usage optimized for big JSON files
