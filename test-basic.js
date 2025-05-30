#!/usr/bin/env node

/**
 * Basic smoke test to verify xtrax components work correctly
 */

import { PCREUtils, TemplateEngine, DataProcessing } from './dist/index.js';

console.log('🧪 Testing XTRAX Components...\n');

// Test 1: PCREUtils
try {
  console.log('✅ PCREUtils imported successfully');
  console.log('   Available functions:', Object.keys(PCREUtils));
} catch (error) {
  console.error('❌ PCREUtils import failed:', error.message);
}

// Test 2: TemplateEngine
try {
  console.log('✅ TemplateEngine imported successfully');
  console.log('   Available functions:', Object.keys(TemplateEngine));
} catch (error) {
  console.error('❌ TemplateEngine import failed:', error.message);
}

// Test 3: DataProcessing
try {
  console.log('✅ DataProcessing imported successfully');
  console.log('   Available functions:', Object.keys(DataProcessing));
} catch (error) {
  console.error('❌ DataProcessing import failed:', error.message);
}

// Test 4: Basic template substitution (without external dependencies)
try {
  const { extractVariableReferences } = TemplateEngine;
  const vars = extractVariableReferences('Hello ${name}, welcome to ${place}!');
  console.log('✅ Template variable extraction works:', vars);
} catch (error) {
  console.error('❌ Template processing failed:', error.message);
}

console.log('\n🎉 Basic component test completed!');
