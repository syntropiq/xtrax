# @syntropiq/xtrax

**XTRAX** (eXtracted Reusable Components) - A TypeScript library providing reusable components for building data processing and regex-based parsing applications.

[![npm version](https://badge.fury.io/js/@syntropiq%2Fxtrax.svg)](https://badge.fury.io/js/@syntropiq%2Fxtrax)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- **PCRE Regex Processing**: Python-compatible regex compilation and processing via `@syntropiq/libpcre-ts`
- **Template Engine**: Variable substitution with circular reference detection and ordinal processing
- **Data Processing**: JSON loading, validation, transformation, and caching utilities
- **TypeScript Project Template**: Pre-configured setup for modern TypeScript projects
- **Dynamic Imports**: Peer dependencies loaded on-demand to avoid build-time requirements

## 📦 Installation

```bash
npm install @syntropiq/xtrax
```

### Peer Dependencies

Install the peer dependencies you need based on which components you use:

```bash
# For PCRE regex processing
npm install @syntropiq/libpcre-ts

# For JSON schema validation
npm install ajv

# For Unicode normalization
npm install unidecode
```

## 🔧 Usage

### PCRE Utilities

Process Python-compatible regex patterns with support for named groups and complex substitutions:

```typescript
import { PCREUtils } from '@syntropiq/xtrax';

// Compile a PCRE regex pattern
const compiled = await PCREUtils.compileRegex('(?P<year>\\d{4})-(?P<month>\\d{2})');

// Convert named groups to JavaScript format
const converted = PCREUtils.convertNamedGroups('(?P<name>\\w+)');
console.log(converted); // "(?<name>\\w+)"

// Process edition substitutions (e.g., "2d" -> "2nd")
const normalized = PCREUtils.substituteEdition('F.2d');
console.log(normalized); // "F.2nd"
```

### Template Engine

Handle complex variable substitution with support for nested templates and ordinal ranges:

```typescript
import { TemplateEngine } from '@syntropiq/xtrax';

// Basic template substitution
const result = TemplateEngine.substituteTemplate(
  'Hello ${name}, welcome to ${place}!',
  { name: 'John', place: 'Boston' }
);
console.log(result); // "Hello John, welcome to Boston!"

// Extract variable references
const vars = TemplateEngine.extractVariableReferences('${first} ${second}');
console.log(vars); // ["first", "second"]

// Process complex variable definitions with circular reference detection
const variables = {
  base: 'Hello',
  greeting: '${base} ${name}',
  name: 'World'
};
const processed = await TemplateEngine.processVariables(variables);
```

### Data Processing

Load, validate, and transform JSON data with comprehensive utilities:

```typescript
import { DataProcessing } from '@syntropiq/xtrax';

// Load JSON file with caching and size limits
const data = await DataProcessing.loadJSONFile('./data.json', {
  maxSize: 10 * 1024 * 1024, // 10MB limit
  cache: true
});

// Validate data against JSON schema
const validator = await DataProcessing.createValidator({
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  },
  required: ['name']
});

const isValid = DataProcessing.validateData(data, validator);

// Transform and normalize string data
const normalized = DataProcessing.normalizeStrings(data, ['name', 'city']);

// Group data by field
const grouped = DataProcessing.groupByField(dataArray, 'category');
```

## 🏗️ Components

### PCREUtils Component

**Purpose**: Python-compatible regex processing for applications that need to maintain compatibility with Python regex patterns.

**Key Functions**:
- `compileRegex()` - Compile PCRE patterns to JavaScript
- `convertNamedGroups()` - Convert Python named groups to JavaScript format
- `substituteEdition()` - Normalize legal edition formats
- `escapeRegex()` - Safely escape regex special characters

### TemplateEngine Component

**Purpose**: Advanced template variable processing with support for complex substitution patterns used in legal data processing.

**Key Functions**:
- `substituteTemplate()` - Basic variable substitution
- `processVariables()` - Recursive processing with circular reference detection
- `extractVariableReferences()` - Parse template variables
- `validateTemplate()` - Ensure all variables can be resolved

### DataProcessing Component

**Purpose**: Comprehensive JSON data handling with validation, transformation, and caching capabilities.

**Key Functions**:
- `loadJSONFile()` - Load JSON with error handling and size limits
- `createValidator()` - Create JSON schema validators
- `transformData()` - Apply transformations to data structures
- `normalizeStrings()` - Unicode normalization for text data

### TypeScript Project Template

**Purpose**: Modern TypeScript project configuration templates for rapid project setup.

**Includes**:
- ESM-compatible `tsconfig.json`
- Vitest configuration for testing
- Package.json template with proper exports
- Project structure guidelines

## 🔧 Configuration

### Environment Setup

XTRAX uses dynamic imports for peer dependencies, so you only need to install the dependencies for the components you actually use:

```typescript
// Only PCRE functionality requires @syntropiq/libpcre-ts
import { PCREUtils } from '@syntropiq/xtrax';

// Only validation functionality requires ajv
import { DataProcessing } from '@syntropiq/xtrax';
const validator = await DataProcessing.createValidator(schema); // Requires ajv

// Only string normalization requires unidecode
const normalized = DataProcessing.normalizeStrings(data, fields); // Requires unidecode
```

### Error Handling

All components gracefully handle missing peer dependencies:

```typescript
try {
  const compiled = await PCREUtils.compileRegex(pattern);
} catch (error) {
  if (error.message.includes('libpcre-ts')) {
    console.log('Install @syntropiq/libpcre-ts for PCRE support');
  }
}
```

## 📋 Examples

### Building a Legal Citation Parser

```typescript
import { PCREUtils, TemplateEngine, DataProcessing } from '@syntropiq/xtrax';

// Load court data with validation
const courts = await DataProcessing.loadJSONFile('./courts.json');

// Process regex patterns from templates
const regexTemplate = '${court_name}\\s+(?P<volume>\\d+)\\s+${reporter}';
const variables = await TemplateEngine.processVariables({
  court_name: 'Supreme Court',
  reporter: 'U\\.S\\.'
});

const pattern = TemplateEngine.substituteTemplate(regexTemplate, variables);
const compiled = await PCREUtils.compileRegex(pattern);

// Match citations in text
const text = 'Supreme Court 123 U.S. 456';
const match = compiled.exec(text);
console.log(match?.groups?.volume); // "123"
```

### Data Pipeline Processing

```typescript
import { DataProcessing } from '@syntropiq/xtrax';

// Load multiple data files
const files = await DataProcessing.loadJSONFiles([
  './courts.json',
  './reporters.json'
]);

// Validate and transform data
const validator = await DataProcessing.createValidator(courtSchema);
const validData = files.filter(data => 
  DataProcessing.validateData(data, validator)
);

// Normalize text fields
const normalized = validData.map(data =>
  DataProcessing.normalizeStrings(data, ['name', 'jurisdiction'])
);

// Group by jurisdiction
const grouped = DataProcessing.groupByField(normalized, 'jurisdiction');
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run basic component verification:

```bash
node test-basic.js
```

## 📝 Development

### Building from Source

```bash
git clone https://github.com/syntropiq/xtrax.git
cd xtrax
npm install
npm run build
```

### Project Structure

```
xtrax/
├── src/
│   ├── pcre-utils/          # PCRE regex processing
│   ├── template-engine/     # Template variable substitution
│   ├── data-processing/     # JSON loading and validation
│   └── typescript-project-template/  # Project templates
├── dist/                    # Compiled JavaScript output
├── tests/                   # Test files
└── docs/                    # Additional documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Extracted and refined from the [Free Law Project](https://free.law/) ecosystem
- Built for the [AMJUR.org](https://amjur.org) legal technology platform
- Uses [@syntropiq/libpcre-ts](https://www.npmjs.com/package/@syntropiq/libpcre-ts) for Python-compatible regex processing

## 📚 Related Projects

- [`@amjur/courts-db-ts`](https://www.npmjs.com/package/@amjur/courts-db-ts) - TypeScript court database using XTRAX
- [`@amjur/reporters-db-ts`](https://www.npmjs.com/package/@amjur/reporters-db-ts) - Legal reporter database with PCRE processing
- [`@syntropiq/libpcre-ts`](https://www.npmjs.com/package/@syntropiq/libpcre-ts) - Python-compatible regex engine for TypeScript

---

**XTRAX** - Making legal data processing components reusable and accessible. 🚀
