const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Debugging TypeScript compilation...');

// First, let's check if our files exist
const filesToCheck = [
  'src/types/index.ts',
  'src/lib/lunarcrush.ts', 
  'src/lib/gemini.ts',
  'tsconfig.json'
];

console.log('📁 Checking if files exist...');
const missingFiles = [];
filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.log('\n❌ Missing files detected. Creating them now...');
  
  // Create missing directories
  if (!fs.existsSync('src/types')) fs.mkdirSync('src/types', { recursive: true });
  if (!fs.existsSync('src/lib')) fs.mkdirSync('src/lib', { recursive: true });
  
  const result = {
    success: false,
    error: 'Missing source files',
    missing_files: missingFiles,
    timestamp: new Date().toISOString(),
    action_needed: 'Need to create missing TypeScript files'
  };
  
  fs.writeFileSync('scripts/typescript-debug-results.json', JSON.stringify(result, null, 2));
  return;
}

console.log('\n📦 Checking TypeScript installation...');
try {
  const tscVersion = execSync('npx tsc --version', { encoding: 'utf8' });
  console.log(`✅ TypeScript version: ${tscVersion.trim()}`);
} catch (error) {
  console.log('❌ TypeScript not properly installed');
  const result = {
    success: false,
    error: 'TypeScript not installed',
    timestamp: new Date().toISOString()
  };
  fs.writeFileSync('scripts/typescript-debug-results.json', JSON.stringify(result, null, 2));
  return;
}

console.log('\n🔍 Running TypeScript compilation with detailed output...');
try {
  // Run with detailed output to see what's wrong
  const output = execSync('npx tsc --noEmit --pretty', { encoding: 'utf8', stdio: 'pipe' });
  
  const result = {
    success: true,
    message: 'TypeScript compilation successful',
    timestamp: new Date().toISOString(),
    files_compiled: filesToCheck.filter(f => f.endsWith('.ts')),
    output: output
  };
  
  console.log('✅ TypeScript compilation passed');
  fs.writeFileSync('scripts/typescript-debug-results.json', JSON.stringify(result, null, 2));
  
} catch (error) {
  const result = {
    success: false,
    error: error.message,
    stderr: error.stderr ? error.stderr.toString() : '',
    stdout: error.stdout ? error.stdout.toString() : '',
    timestamp: new Date().toISOString()
  };
  
  console.log('❌ TypeScript compilation failed:');
  console.log('STDERR:', error.stderr ? error.stderr.toString() : 'none');
  console.log('STDOUT:', error.stdout ? error.stdout.toString() : 'none');
  
  fs.writeFileSync('scripts/typescript-debug-results.json', JSON.stringify(result, null, 2));
}
