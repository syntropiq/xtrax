# TypeScript Project Template

Standard TypeScript project structure and configuration for legal data processing projects using PCRE and modern ESM modules.

## Features

- **Modern ESM modules**: Full ES module support with proper imports/exports
- **Strict TypeScript configuration**: Maximum type safety with strict settings
- **Vitest testing setup**: Fast, modern testing framework
- **PCRE integration ready**: Pre-configured for `@syntropiq/libpcre-ts`
- **Build pipeline**: TypeScript compilation with source maps and declarations
- **Package publishing**: Ready for npm publication with proper exports

## Files

- `package.template.json` - Package.json template with common dependencies
- `tsconfig.template.json` - TypeScript configuration with strict settings
- `vitest.config.template.ts` - Vitest testing configuration
- `project-structure.md` - Recommended project structure
- `README.md` - This documentation

## Usage

1. Copy template files to your new project
2. Replace template placeholders:
   - `{{PROJECT_NAME}}` - Your project name (e.g., `@amjur/courts-db-ts`)
   - `{{PROJECT_DESCRIPTION}}` - Project description
   - `{{GITHUB_REPO}}` - GitHub repository name
   - `{{MAIN_DATA_TYPE}}` - Primary data type (e.g., `courts`, `reporters`)

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start development:
   ```bash
   npm run dev
   ```

## Dependencies Included

### Core Dependencies
- `@syntropiq/libpcre-ts` - PCRE regex engine
- `ajv` - JSON schema validation
- `unidecode` - Unicode normalization

### Development Dependencies  
- `typescript` - TypeScript compiler
- `vitest` - Testing framework
- `@types/node` - Node.js type definitions

## Project Structure

```
my-project/
├── src/
│   ├── index.ts           # Main exports
│   ├── types.ts           # Type definitions
│   ├── utils.ts           # Utility functions
│   └── data/              # JSON data files
├── tests/
│   ├── unit/              # Unit tests
│   └── integration/       # Integration tests
├── dist/                  # Compiled output
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## Configuration Features

### TypeScript (tsconfig.json)
- ES2022 target for modern features
- Strict type checking enabled
- Source maps and declarations
- ESM module resolution
- No emit on errors

### Testing (vitest.config.ts)
- Node.js environment
- Global test functions
- Fast execution
- Watch mode disabled by default

### Package (package.json)
- ESM module type
- Proper exports configuration
- Build and test scripts
- Publishing ready
