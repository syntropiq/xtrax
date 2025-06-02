// Main index file for XTRAX - Exported Reusable Components
// This provides a convenient way to import all utilities from a single location

// PCRE Utilities
export * as PCREUtils from './pcre-utils/index.js';

// Template Engine  
export * as TemplateEngine from './template-engine/index.js';

// Data Processing
export * as DataProcessing from './data-processing/index.js';

// Re-export commonly used types for convenience
export type { 
  RegexMatch, 
  PCRECompileOptions, 
  SubstitutionContext 
} from './pcre-utils/index.js';

export type { 
  RegexVariables, 
  TemplateContext, 
  VariableProcessingResult 
} from './template-engine/index.js';

export type {
  ValidationResult,
  ValidationError,
  TransformOptions
} from './data-processing/index.js';
