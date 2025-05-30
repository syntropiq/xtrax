import type { TemplateContext, SubstitutionOptions } from './types.js';

/**
 * Advanced template string substitution with context
 */
export function substituteTemplate(
  template: string,
  context: TemplateContext
): string {
  const options: SubstitutionOptions = {
    maxDepth: context.maxDepth || 100,
    preserveUnresolved: context.preserveUnresolved ?? true,
    logWarnings: true
  };

  return recursiveSubstitute(template, context.variables, options.maxDepth!);
}

/**
 * Substitute multiple templates at once
 */
export function substituteTemplates(
  templates: Record<string, string>,
  context: TemplateContext
): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const [key, template] of Object.entries(templates)) {
    result[key] = substituteTemplate(template, context);
  }
  
  return result;
}

/**
 * Extract variable references from a template string
 */
export function extractVariableReferences(template: string): string[] {
  const matches = template.match(/\$\{?(\w+)\}?/g);
  if (!matches) return [];
  
  return matches.map(match => {
    const varMatch = match.match(/\$\{?(\w+)\}?/);
    return varMatch ? varMatch[1] : '';
  }).filter((name): name is string => Boolean(name));
}

/**
 * Validate that all variable references in a template can be resolved
 */
export function validateTemplate(
  template: string,
  variables: Record<string, string>
): { isValid: boolean; missingVariables: string[] } {
  const references = extractVariableReferences(template);
  const missingVariables = references.filter(ref => !(ref in variables));
  
  return {
    isValid: missingVariables.length === 0,
    missingVariables
  };
}

/**
 * Basic recursive substitution (re-exported from variable-processor)
 */
function recursiveSubstitute(
  template: string, 
  variables: Record<string, string>, 
  maxDepth = 100
): string {
  let oldVal = template;
  
  for (let i = 0; i < maxDepth; i++) {
    const newVal = oldVal.replace(/\$\{?(\w+)\}?/g, (match, varName) => {
      return variables[varName] || match;
    });
    
    if (newVal === oldVal) {
      break;
    }
    oldVal = newVal;
  }
  
  return oldVal;
}
