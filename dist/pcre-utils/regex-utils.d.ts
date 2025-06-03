/**
 * Escape special regex characters in a string
 */
export declare function escapeRegex(str: string): string;
/**
 * Insert edition_name in place of $edition placeholder.
 */
export declare function substituteEdition(regex: string, editionName: string): string;
/**
 * Insert edition strings for the given edition into a regex with an $edition placeholder.
 * Creates alternation groups for all variations of an edition.
 *
 * Example:
 *     substituteEditions('\\d+ $edition \\d+', 'Foo.', {'Foo. Var.': 'Foo.'})
 *     Result: ["\\d+ (?:Foo\\.|Foo\\. Var\\.) \\d+"]
 */
export declare function substituteEditions(regex: string, editionName: string, variations: Record<string, string>): string[];
/**
 * Get a PCRE pattern from pre-converted regex data with substitutions applied.
 * This navigates nested JSON structures to find regex patterns and applies variable substitutions.
 */
export declare function getPCREPatternFromData(regexData: any, templatePath: string, substitutions?: Record<string, string>): string;
//# sourceMappingURL=regex-utils.d.ts.map