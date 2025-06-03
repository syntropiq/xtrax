# @syntropiq/xtrax

**XTRAX** (eXtracted Reusable Components) - A TypeScript library providing reusable components for building data processing and regex-based parsing applications. **Optimized for Cloudflare Workers and serverless environments.**

[![npm version](https://badge.fury.io/js/@syntropiq%2Fxtrax.svg)](https://badge.fury.io/js/@syntropiq%2Fxtrax)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![GPL License](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## 🚀 Features

- **PCRE Regex Processing**: Python-compatible regex compilation and processing via `@syntropiq/libpcre-ts`
- **Template Engine**: Variable substitution with circular reference detection and ordinal processing
- **Data Processing**: In-memory JSON validation, transformation, and manipulation utilities
- **TypeScript Project Template**: Pre-configured setup for modern TypeScript projects
- **Serverless Ready**: Zero file system dependencies, works in Cloudflare Workers and edge environments
- **Lightweight**: No external dependencies for core functionality

## 📦 Installation

```bash
npm install @syntropiq/xtrax
```

### Optional Peer Dependencies

Install peer dependencies only for specific functionality you need:

```bash
# For PCRE regex processing (server environments only)
npm install @syntropiq/libpcre-ts

# For Unicode normalization
npm install unidecode
```

**Note**: File processing functionality has been removed for serverless compatibility. All data should be provided as in-memory JavaScript objects or plain text strings.

## 🔧 Usage

### Working with Plain Text Input

XTRAX is designed to work with data you provide directly, rather than loading from files:

```typescript
import { TemplateEngine, DataProcessing } from '@syntropiq/xtrax';

// Template processing with plain text
const templateText = 'Hello ${name}, welcome to ${place}!';
const variables = { name: 'John', place: 'Boston' };
const result = TemplateEngine.substituteTemplate(templateText, variables);
console.log(result); // "Hello John, welcome to Boston!"

// Data validation with in-memory objects
const userSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  },
  required: ['name']
};

const userData = { name: 'Alice', age: 30 };
const validationResult = DataProcessing.validateDataWithSchema(userData, userSchema);
console.log(validationResult.isValid); // true
```

### PCRE Utilities (Server Environments)

Process Python-compatible regex patterns:

```typescript
import { PCREUtils } from '@syntropiq/xtrax';

// Convert named groups to JavaScript format
const converted = PCREUtils.convertNamedGroups('(?P<name>\\w+)');
console.log(converted); // "(?<name>\\w+)"

// Process edition substitutions (e.g., "2d" -> "2nd")
const normalized = PCREUtils.substituteEdition('F.2d');
console.log(normalized); // "F.2nd"

// Note: compileRegex() requires @syntropiq/libpcre-ts and Node.js environment
```

### Template Engine

Handle complex variable substitution with plain text templates:

```typescript
import { TemplateEngine } from '@syntropiq/xtrax';

// Basic template substitution
const result = TemplateEngine.substituteTemplate(
  'Hello ${name}, welcome to ${place}!',
  { name: 'John', place: 'Boston' }
);

// Extract variable references from template strings
const templateString = '${greeting} ${name}, today is ${day}';
const vars = TemplateEngine.extractVariableReferences(templateString);
console.log(vars); // ["greeting", "name", "day"]

// Process complex variable definitions with circular reference detection
const variables = {
  base: 'Hello',
  greeting: '${base} ${name}',
  name: 'World'
};
const processed = TemplateEngine.processVariables(variables);
console.log(processed.greeting); // "Hello World"
```

### Data Processing (In-Memory)

Validate and transform JavaScript objects directly:

```typescript
import { DataProcessing } from '@syntropiq/xtrax';

// Create data objects directly (no file loading)
const sampleData = [
  { name: 'John Doe', category: 'developer', age: 30 },
  { name: 'Jane Smith', category: 'designer', age: 28 },
  { name: 'Bob Wilson', category: 'developer', age: 35 }
];

// Basic validation with simple schema
const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  },
  required: ['name']
};

// Validate individual items
const isValid = DataProcessing.validateDataWithSchema(sampleData[0], schema);
console.log(isValid); // { isValid: true, data: {...}, errors: [] }

// Transform and normalize string data
const normalized = DataProcessing.normalizeStrings(sampleData, ['name']);

// Group data by field
const grouped = DataProcessing.groupByField(sampleData, 'category');
console.log(grouped);
// { developer: [...], designer: [...] }

// Extract unique values
const categories = DataProcessing.extractUniqueValues(sampleData, 'category');
console.log(categories); // ['developer', 'designer']
```

## 🏗️ Components

### PCREUtils Component

**Purpose**: Python-compatible regex processing for applications that need to maintain compatibility with Python regex patterns.

**Key Functions**:
- `convertNamedGroups()` - Convert Python named groups to JavaScript format
- `substituteEdition()` - Normalize legal edition formats
- `escapeRegex()` - **Python-compatible regex escaping** including spaces (matches Python's `re.escape()`)
- `compileRegex()` - Compile PCRE patterns (requires peer dependency and Node.js)

#### Python Regex Compatibility

XTRAX's `escapeRegex()` function provides **perfect fidelity** with Python's `re.escape()` function, including escaping spaces:

```typescript
import { PCREUtils } from '@syntropiq/xtrax';

// JavaScript native escaping (spaces NOT escaped)
const jsEscaped = 'Ala. Admin. Code'.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
console.log(jsEscaped); // "Ala\. Admin\. Code"

// XTRAX Python-compatible escaping (spaces ARE escaped)
const pythonEscaped = PCREUtils.escapeRegex('Ala. Admin. Code');
console.log(pythonEscaped); // "Ala\.\  Admin\.\  Code"
```

**When to use XTRAX escapeRegex():**
- When building regex patterns that must match Python regex library behavior
- When migrating Python regex code to TypeScript
- When working with legal citation patterns that include spaces (e.g., "F. 2d", "Ala. Admin. Code")
- When ensuring cross-platform regex compatibility between Python and TypeScript applications

### TemplateEngine Component

**Purpose**: Advanced template variable processing with support for complex substitution patterns.

**Key Functions**:
- `substituteTemplate()` - Basic variable substitution in text
- `processVariables()` - Recursive processing with circular reference detection
- `extractVariableReferences()` - Parse template variables from strings
- `validateTemplate()` - Ensure all variables can be resolved

### DataProcessing Component

**Purpose**: In-memory JSON data handling with validation and transformation capabilities.

**Key Functions**:
- `validateDataWithSchema()` - Validate objects against JSON schemas
- `transformData()` - Apply transformations to data structures
- `normalizeStrings()` - Unicode normalization for text data
- `groupByField()` - Group arrays of objects by field values
- `extractUniqueValues()` - Get unique values from object arrays

**Important**: File loading functionality has been removed. All data should be provided as JavaScript objects or loaded through your application's own file handling logic.

## 🌐 Cloudflare Workers & Serverless

XTRAX is fully compatible with serverless environments:

```typescript
// Example Cloudflare Worker
export default {
  async fetch(request, env, ctx) {
    const { TemplateEngine, DataProcessing } = await import('@syntropiq/xtrax');
    
    // Process template from request
    const template = await request.text();
    const variables = { timestamp: new Date().toISOString() };
    const result = TemplateEngine.substituteTemplate(template, variables);
    
    return new Response(result, {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
```

## 📋 Examples

### Building a Citation Parser with Plain Text

```typescript
import { TemplateEngine, DataProcessing } from '@syntropiq/xtrax';

// Define court data directly in your application
const courtsData = [
  { name: 'Supreme Court', abbreviation: 'S.Ct.' },
  { name: 'Federal Reporter', abbreviation: 'F.' }
];

// Process regex patterns from templates
const regexTemplate = '${court_name}\\s+(?<volume>\\d+)\\s+${reporter}';
const variables = {
  court_name: 'Supreme Court',
  reporter: 'U\\.S\\.'
};

const pattern = TemplateEngine.substituteTemplate(regexTemplate, variables);
console.log(pattern); // "Supreme Court\\s+(?<volume>\\d+)\\s+U\\.S\\."

// Use standard JavaScript regex (no PCRE dependency needed in many cases)
const regex = new RegExp(pattern);
const text = 'Supreme Court 123 U.S. 456';
const match = regex.exec(text);
console.log(match?.groups?.volume); // "123"
```

### Data Pipeline Processing with In-Memory Data

```typescript
import { DataProcessing } from '@syntropiq/xtrax';

// Define your data directly or load it through your own logic
const rawData = [
  { name: 'Court of Appeals', jurisdiction: 'federal', type: 'appellate' },
  { name: 'District Court', jurisdiction: 'federal', type: 'trial' },
  { name: 'State Supreme Court', jurisdiction: 'state', type: 'appellate' }
];

// Basic schema for validation
const courtSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    jurisdiction: { type: 'string' },
    type: { type: 'string' }
  },
  required: ['name', 'jurisdiction']
};

// Validate each item
const validatedData = rawData.filter(court => {
  const result = DataProcessing.validateDataWithSchema(court, courtSchema);
  return result.isValid;
});

// Normalize text fields
const normalizedData = validatedData.map(court =>
  DataProcessing.normalizeStrings(court, ['name'])
);

// Group by jurisdiction
const grouped = DataProcessing.groupByField(normalizedData, 'jurisdiction');
console.log(grouped.federal.length); // Number of federal courts
```

### Template Processing for Dynamic Content

```typescript
import { TemplateEngine } from '@syntropiq/xtrax';

// Email template example
const emailTemplate = `
Dear ${name},

Your ${document_type} for case ${case_number} has been ${status}.

${additional_info}

Best regards,
${sender_name}
`;

const templateVars = {
  name: 'John Doe',
  document_type: 'motion',
  case_number: '2024-CV-001',
  status: 'approved',
  additional_info: 'Please proceed with the next steps.',
  sender_name: 'Legal Assistant'
};

const personalizedEmail = TemplateEngine.substituteTemplate(emailTemplate, templateVars);
console.log(personalizedEmail);
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
├── pcre-utils/              # PCRE regex processing
├── template-engine/         # Template variable substitution
├── data-processing/         # In-memory data validation & transformation
├── typescript-project-template/  # Project templates
├── __tests__/               # Test files
└── index.ts                 # Main exports
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the GNU General Public License v3.0 or later - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Extracted and refined from the [Free Law Project](https://free.law/) ecosystem
- Built for the [AMJUR.org](https://amjur.org) legal technology platform
- Uses [@syntropiq/libpcre-ts](https://www.npmjs.com/package/@syntropiq/libpcre-ts) for Python-compatible regex processing (optional)

## 📚 Related Projects

- [`@amjur/courts-db-ts`](https://www.npmjs.com/package/@amjur/courts-db-ts) - TypeScript court database using XTRAX
- [`@amjur/reporters-db-ts`](https://www.npmjs.com/package/@amjur/reporters-db-ts) - Legal reporter database with PCRE processing
- [`@syntropiq/libpcre-ts`](https://www.npmjs.com/package/@syntropiq/libpcre-ts) - Python-compatible regex engine for TypeScript

---

**XTRAX** - Making legal data processing components reusable and serverless-ready. 🚀
