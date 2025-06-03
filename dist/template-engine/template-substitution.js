/**
 * Advanced template string substitution with context
 */
export function substituteTemplate(template, context) {
    const options = {
        maxDepth: context.maxDepth || 100,
        preserveUnresolved: context.preserveUnresolved ?? true,
        logWarnings: true
    };
    return recursiveSubstitute(template, context.variables, options.maxDepth);
}
/**
 * Substitute multiple templates at once
 */
export function substituteTemplates(templates, context) {
    const result = {};
    for (const [key, template] of Object.entries(templates)) {
        result[key] = substituteTemplate(template, context);
    }
    return result;
}
/**
 * Extract variable references from a template string
 */
export function extractVariableReferences(template) {
    const matches = template.match(/\$\{?(\w+)\}?/g);
    if (!matches)
        return [];
    return matches.map(match => {
        const varMatch = match.match(/\$\{?(\w+)\}?/);
        return varMatch ? varMatch[1] : '';
    }).filter((name) => Boolean(name));
}
/**
 * Validate that all variable references in a template can be resolved
 */
export function validateTemplate(template, variables) {
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
function recursiveSubstitute(template, variables, maxDepth = 100) {
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
//# sourceMappingURL=template-substitution.js.map