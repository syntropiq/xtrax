/**
 * Type definitions for template engine
 */

/**
 * Processed regex variables mapping
 */
export type RegexVariables = Record<string, string>;

/**
 * Template substitution context with metadata
 */
export interface TemplateContext {
  variables: RegexVariables;
  maxDepth?: number;
  preserveUnresolved?: boolean;
}

/**
 * Result of variable processing with statistics
 */
export interface VariableProcessingResult {
  variables: RegexVariables;
  stats: {
    originalVariableCount: number;
    processedVariableCount: number;
    processingTimeMs: number;
    optionalVariablesAdded: number;
  };
}

/**
 * Template substitution options
 */
export interface SubstitutionOptions {
  maxDepth?: number;
  preserveUnresolved?: boolean;
  logWarnings?: boolean;
}

/**
 * Variable validation result
 */
export interface VariableValidationResult {
  isValid: boolean;
  errors: string[];
  circularReferences: string[];
  unresolvedReferences: string[];
}
