/**
 * Type definitions for PCRE utilities
 * Note: These types are placeholders - projects using this must install @syntropiq/libpcre-ts
 */
export interface PCRE {
    init(): Promise<void>;
    compile(pattern: string, flags?: number): PCRERegex;
    constants: {
        ANCHORED: number;
        UTF8: number;
    };
}
export interface PCRERegex {
    match(text: string): any;
    test(text: string): boolean;
}
/**
 * Basic regex match result interface
 */
export interface RegexMatch {
    matched: boolean;
    groups?: Record<string, string>;
    fullMatch?: string;
}
/**
 * Configuration for PCRE compilation
 */
export interface PCRECompileOptions {
    anchored?: boolean;
    utf8?: boolean;
    caseInsensitive?: boolean;
    multiline?: boolean;
}
/**
 * Template substitution context
 */
export interface SubstitutionContext {
    variables: Record<string, string>;
    regexData?: any;
    customSubstitutions?: Record<string, string>;
}
//# sourceMappingURL=types.d.ts.map