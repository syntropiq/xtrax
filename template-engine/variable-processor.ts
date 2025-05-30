import type { RegexVariables, VariableProcessingResult } from './types.js';

/**
 * Process contents of variables.json, in preparation for recursive substitution:
 * 
 * - Strip keys ending in '#', which are treated as comments
 * - Flatten nested dicts, so {"page": {"": "A", "foo": "B"}} becomes {"page": "A", "page_foo": "B"}
 * - Add optional variants for each key, so {"page": "\\d+"} becomes {"page_optional": "(?:\\d+ ?)?"}
 * - Resolve nested references safely with circular reference detection
 */
export function processVariables(variables: Record<string, unknown>): RegexVariables {
  // Flatten variables and remove comments
  function flatten(d: Record<string, unknown>, parentKey = ''): Record<string, string> {
    const items: Record<string, string> = {};
    
    for (const [k, v] of Object.entries(d)) {
      // Skip comment keys
      if (k.endsWith('#')) {
        continue;
      }
      
      const newKey = [parentKey, k].filter(Boolean).join('_');
      
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        // Recursively flatten nested objects
        Object.assign(items, flatten(v as Record<string, unknown>, newKey));
      } else {
        // Convert to string and store
        items[newKey] = String(v);
      }
    }
    
    return items;
  }

  let processedVariables = flatten(variables);
  
  // Add optional variables - wrap each variable in optional group
  const optionalVars: Record<string, string> = {};
  for (const [k, v] of Object.entries(processedVariables)) {
    optionalVars[`${k}_optional`] = `(?:${v} ?)?`;
  }
  processedVariables = { ...processedVariables, ...optionalVars };
  
  // Resolve references safely - detect cycles and skip problematic variables
  const resolvedVariables: RegexVariables = {};
  for (const [k, v] of Object.entries(processedVariables)) {
    try {
      resolvedVariables[k] = recursiveSubstitute(v, processedVariables);
    } catch (error) {
      // If we hit max depth (circular reference), just use the original value
      console.warn(`Circular reference detected for variable '${k}': ${v}`);
      resolvedVariables[k] = v;
    }
  }
  
  return resolvedVariables;
}

/**
 * Recursively substitute values in `template` from `variables`. For example:
 *     recursiveSubstitute("$a $b $c", {'a': '$b', 'b': '$c', 'c': 'foo'})
 *     Result: "foo foo foo"
 * 
 * Infinite loops will be detected after maxDepth iterations and the function
 * will return the partially resolved result.
 */
export function recursiveSubstitute(
  template: string, 
  variables: Record<string, string>, 
  maxDepth = 100
): string {
  let oldVal = template;
  
  for (let i = 0; i < maxDepth; i++) {
    // Replace variables in the format $var or ${var}
    const newVal = oldVal.replace(/\$\{?(\w+)\}?/g, (match, varName) => {
      return variables[varName] || match;
    });
    
    // If no changes were made, we're done
    if (newVal === oldVal) {
      break;
    }
    oldVal = newVal;
  }
  
  // Don't throw error for unresolved variables - just return what we have
  // This matches the Python behavior where unresolved variables are left as-is
  
  return oldVal;
}

/**
 * Process variables with detailed result information
 */
export function processVariablesWithResult(variables: Record<string, unknown>): VariableProcessingResult {
  const startTime = Date.now();
  const originalCount = countVariables(variables);
  
  const processed = processVariables(variables);
  
  const endTime = Date.now();
  const processedCount = Object.keys(processed).length;
  
  return {
    variables: processed,
    stats: {
      originalVariableCount: originalCount,
      processedVariableCount: processedCount,
      processingTimeMs: endTime - startTime,
      optionalVariablesAdded: Math.floor((processedCount - originalCount) / 2) // Rough estimate
    }
  };
}

/**
 * Count variables in nested structure
 */
function countVariables(variables: Record<string, unknown>): number {
  let count = 0;
  
  function countRecursive(obj: Record<string, unknown>) {
    for (const [key, value] of Object.entries(obj)) {
      if (key.endsWith('#')) {
        continue; // Skip comments
      }
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        countRecursive(value as Record<string, unknown>);
      } else {
        count++;
      }
    }
  }
  
  countRecursive(variables);
  return count;
}
