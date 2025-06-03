import type { PCRERegex } from './types.js';
/**
 * Convert Python named capture groups (?P<name>...) to PCRE format (?<name>...)
 */
export declare function convertNamedGroups(pattern: string): string;
/**
 * Compile a PCRE regex with fullmatch semantics (like Python's re.fullmatch).
 * Anchors the pattern at both ends and uses ANCHORED, UTF8, and UNICODE options.
 */
export declare function compileRegex(pattern: string): Promise<PCRERegex>;
/**
 * Compile a regex pattern using PCRE without fullmatch anchoring
 * Useful for partial matching or when you want to control anchoring manually
 */
export declare function compileRegexPartial(pattern: string): Promise<PCRERegex>;
//# sourceMappingURL=pcre-compiler.d.ts.map