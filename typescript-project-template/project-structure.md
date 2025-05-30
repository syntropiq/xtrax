# Recommended Project Structure

This is the standardized project structure for legal data processing TypeScript projects.

## Directory Layout

```
project-name/
├── src/                           # Source code
│   ├── index.ts                   # Main exports and public API
│   ├── types.ts                   # TypeScript type definitions
│   ├── utils.ts                   # Utility functions and helpers
│   ├── data/                      # JSON data files
│   │   ├── {{MAIN_DATA_TYPE}}.json   # Primary data (e.g., courts.json, reporters.json)
│   │   ├── variables.json         # Regex variable definitions
│   │   └── schemas/               # JSON schemas for validation
│   │       └── {{MAIN_DATA_TYPE}}.schema.json
│   └── lib/                       # Internal modules (optional)
│       ├── parser.ts              # Data parsing logic
│       └── matcher.ts             # Matching algorithms
├── tests/                         # Test files
│   ├── unit/                      # Unit tests
│   │   ├── utils.test.ts
│   │   └── parser.test.ts
│   ├── integration/               # Integration tests
│   │   └── api.test.ts
│   └── fixtures/                  # Test data
│       └── sample-data.json
├── dist/                          # Compiled output (generated)
├── node_modules/                  # Dependencies (generated)
├── package.json                   # Package configuration
├── tsconfig.json                  # TypeScript configuration
├── vitest.config.ts              # Test configuration
├── README.md                     # Project documentation
├── CHANGES.md                    # Changelog
└── LICENSE                       # License file
```

## Key Files Description

### `/src/index.ts`
Main entry point that exports the public API:
```typescript
export { findCourt, findCourtById } from './lib/matcher.js';
export type { Court, CourtData } from './types.js';
export { loadData, validateData } from './utils.js';
```

### `/src/types.ts`
TypeScript interfaces and type definitions:
```typescript
export interface CourtData {
  name: string;
  regexes: string[];
  examples: string[];
  // ... other fields
}
```

### `/src/utils.ts`
Utility functions for data processing:
```typescript
export function loadData(): Promise<CourtData[]>;
export function validateData(data: unknown): CourtData[];
```

### `/src/data/`
Contains all JSON data files:
- Primary data (courts.json, reporters.json, etc.)
- Variable definitions for regex templates
- JSON schemas for validation

### `/tests/`
Organized test structure:
- `unit/` - Fast, isolated tests
- `integration/` - End-to-end API tests  
- `fixtures/` - Sample data for testing

## Naming Conventions

### Files
- Use kebab-case for files: `court-matcher.ts`
- Use PascalCase for classes: `CourtMatcher`
- Use camelCase for functions: `findCourt`

### Types
- Use PascalCase for interfaces: `CourtData`
- Use camelCase for properties: `courtName`
- Suffix arrays with plural: `courts: CourtData[]`

### Constants
- Use UPPER_SNAKE_CASE: `DEFAULT_TIMEOUT`
- Group related constants in enums

## Build Output

The `/dist/` directory contains:
```
dist/
├── index.js              # Compiled main entry
├── index.d.ts            # Type declarations
├── types.js              # Compiled types
├── types.d.ts            # Type declarations
├── utils.js              # Compiled utilities
├── utils.d.ts            # Type declarations
└── lib/                  # Compiled internal modules
```

## Best Practices

1. **Single Responsibility**: Each file has one clear purpose
2. **Consistent Exports**: Use named exports, avoid default exports
3. **Type Safety**: Everything is properly typed
4. **Testing**: Comprehensive test coverage
5. **Documentation**: Clear README and inline comments
