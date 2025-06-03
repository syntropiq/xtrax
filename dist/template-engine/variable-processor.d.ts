import type { RegexVariables, VariableProcessingResult } from './types.js';
/**
 * Process contents of variables.json, in preparation for recursive substitution:
 *
 * - Strip keys ending in '#', which are treated as comments
 * - Flatten nested dicts, so {"page": {"": "A", "foo": "B"}} becomes {"page": "A", "page_foo": "B"}
 * - Add optional variants for each key, so {"page": "\\d+"} becomes {"page_optional": "(?:\\d+ ?)?"}
 * - Resolve nested references safely with circular reference detection
 */
export declare function processVariables(variables: Record<string, unknown>): RegexVariables;
/**
 * Recursively substitute values in `template` from `variables`. For example:
 *     recursiveSubstitute("$a $b $c", {'a': '$b', 'b': '$c', 'c': 'foo'})
 *     Result: "foo foo foo"
 *
 * Infinite loops will be detected after maxDepth iterations and the function
 * will return the partially resolved result.
 */
export declare function recursiveSubstitute(template: string, variables: Record<string, string>, maxDepth?: number): string;
/**
 * Process variables with detailed result information
 */
export declare function processVariablesWithResult(variables: Record<string, unknown>): VariableProcessingResult;
//# sourceMappingURL=variable-processor.d.ts.map