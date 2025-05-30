# Template Engine - Variable Substitution System

Advanced template variable processing system with recursive substitution, circular reference detection, and nested variable flattening.

## Features

- **Recursive substitution**: Resolves nested variable references like `$a -> $b -> $c -> "value"`
- **Circular reference detection**: Prevents infinite loops in variable substitution
- **Optional variable generation**: Automatically creates `${var}_optional` variants
- **Nested variable flattening**: Converts `{"page": {"": "A", "foo": "B"}}` to `{"page": "A", "page_foo": "B"}`
- **Comment filtering**: Strips keys ending in '#' (treated as comments)
- **Safe error handling**: Gracefully handles unresolvable variables

## Files

- `variable-processor.ts` - Core variable processing logic
- `template-substitution.ts` - Template string substitution utilities
- `types.ts` - TypeScript type definitions
- `README.md` - This documentation

## Usage

```typescript
import { processVariables, recursiveSubstitute } from './variable-processor.js';

// Process a variables.json structure
const variables = {
  volume: "\\d+",
  page: {
    "": "\\d+",
    "with_commas": "\\d(?:[\\d,]*\\d)?"
  },
  cite: "$volume $page"
};

const processed = processVariables(variables);
// Result: {
//   volume: "\\d+",
//   volume_optional: "(?:\\d+ ?)?",
//   page: "\\d+", 
//   page_optional: "(?:\\d+ ?)?",
//   page_with_commas: "\\d(?:[\\d,]*\\d)?",
//   page_with_commas_optional: "(?:\\d(?:[\\d,]*\\d)? ?)?",
//   cite: "\\d+ \\d+"
// }

// Direct template substitution
const result = recursiveSubstitute("$volume $page", {
  volume: "\\d+",
  page: "\\d+"
});
// Result: "\\d+ \\d+"
```

## Key Algorithms

### Variable Flattening
Converts nested JSON structures into flat key-value pairs:
- `{"page": {"": "A", "foo": "B"}}` → `{"page": "A", "page_foo": "B"}`

### Optional Variable Generation  
Automatically creates optional variants:
- `{"volume": "\\d+"}` → `{"volume": "\\d+", "volume_optional": "(?:\\d+ ?)?"}`

### Circular Reference Detection
Uses max depth limit to prevent infinite recursion:
- Detects cycles in variable references
- Falls back to original value on detection
- Logs warnings for debugging

## Notes

- Compatible with Python regex variable formats
- Handles `$var` and `${var}` substitution patterns
- Preserves unresolvable variables as-is (matches Python behavior)
- Thread-safe and stateless processing
