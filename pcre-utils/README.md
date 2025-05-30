# PCRE Integration Utilities

Provides TypeScript utilities for working with PCRE (Perl Compatible Regular Expressions) using `@syntropiq/libpcre-ts`, designed to match Python's `re.fullmatch` semantics.

## Features

- **Python-compatible regex compilation**: Converts Python named groups to PCRE format
- **Fullmatch semantics**: Automatically anchors patterns for exact matching
- **Performance optimization**: Singleton PCRE instance management
- **Error handling**: Robust error handling for regex compilation
- **Type safety**: Full TypeScript support with proper types

## Files

- `pcre-compiler.ts` - Main PCRE compilation utilities
- `regex-utils.ts` - Helper functions for regex processing
- `types.ts` - TypeScript type definitions
- `README.md` - This documentation

## Usage

```typescript
import { compileRegex, convertNamedGroups } from './pcre-compiler.js';

// Compile a pattern with Python-like fullmatch semantics
const regex = await compileRegex('(?P<volume>\\d+) (?P<page>\\d+)');

// Convert Python named groups to PCRE format
const pcrePattern = convertNamedGroups('(?P<name>\\w+)');
// Result: '(?<name>\\w+)'
```

## Dependencies

- `@syntropiq/libpcre-ts`: PCRE regex engine for JavaScript/TypeScript
- `typescript`: For type checking and compilation

## Notes

- Uses singleton pattern for PCRE instance to avoid initialization overhead
- Automatically anchors patterns with `^` and `$` for fullmatch behavior
- Uses ANCHORED and UTF8 flags for Python compatibility
- Handles circular references in variable substitution
