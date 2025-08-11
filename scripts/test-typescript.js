const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Testing TypeScript compilation...');

try {
  // Test TypeScript compilation using npx
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  
  const result = {
    success: true,
    message: 'TypeScript compilation successful',
    timestamp: new Date().toISOString(),
    files_compiled: [
      'src/types/index.ts',
      'src/lib/lunarcrush.ts', 
      'src/lib/gemini.ts'
    ]
  };
  
  console.log('✅ TypeScript compilation passed');
  fs.writeFileSync('scripts/typescript-test-results.json', JSON.stringify(result, null, 2));
  
} catch (error) {
  const result = {
    success: false,
    error: error.message,
    timestamp: new Date().toISOString()
  };
  
  console.log('❌ TypeScript compilation failed:', error.message);
  fs.writeFileSync('scripts/typescript-test-results.json', JSON.stringify(result, null, 2));
  process.exit(1);
}
