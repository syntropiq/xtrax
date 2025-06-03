import type { TemplateContext } from './types.js';
/**
 * Advanced template string substitution with context
 */
export declare function substituteTemplate(template: string, context: TemplateContext): string;
/**
 * Substitute multiple templates at once
 */
export declare function substituteTemplates(templates: Record<string, string>, context: TemplateContext): Record<string, string>;
/**
 * Extract variable references from a template string
 */
export declare function extractVariableReferences(template: string): string[];
/**
 * Validate that all variable references in a template can be resolved
 */
export declare function validateTemplate(template: string, variables: Record<string, string>): {
    isValid: boolean;
    missingVariables: string[];
};
//# sourceMappingURL=template-substitution.d.ts.map