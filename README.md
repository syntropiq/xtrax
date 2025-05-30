# XTRAX - Extracted Reusable Components

This folder contains reusable components extracted from the `reporters-db-ts` project that can be shared across multiple similar projects (courts-db-ts, laws-db-ts, etc.).

## Components

### 1. **pcre-utils** - PCRE Integration Utilities
- PCRE compilation with Python-like semantics
- Named group conversion (Python (?P<name>) → PCRE (?<name>))
- Fullmatch anchoring for exact pattern matching
- Error handling and performance optimization

### 2. **template-engine** - Variable Substitution System
- Complex variable processing with recursive substitution
- Circular reference detection and handling
- Optional variable generation (`${var}_optional`)
- Nested variable flattening from JSON structures
- Template variable substitution

### 3. **typescript-project-template** - Project Structure
- Modern ESM TypeScript configuration
- Package.json template with common dependencies
- Build and test configuration
- Vitest testing setup
- Standard project structure

### 4. **data-processing** - Data Pipeline Utilities
- JSON schema validation with AJV
- File system integration for data loading
- Data transformation utilities
- Error handling patterns
- Type-safe data processing

## Usage

Each component is designed to be:
- **Standalone**: Can be used independently
- **Configurable**: Easily adapted to different use cases
- **Type-safe**: Full TypeScript support
- **Tested**: Includes test patterns and examples
- **Documented**: Clear usage instructions

## Design Principles

1. **Consistency**: All projects using these components will have identical architecture
2. **Maintainability**: Single source of truth for common functionality
3. **Reusability**: Easy to copy/adapt for new projects
4. **Standards**: Follows best practices for TypeScript/Node.js development

## Projects Using XTRAX

- `reporters-db-ts` (original source)
- `courts-db-ts` (planned)
- `laws-db-ts` (future)
- `journals-db-ts` (future)
