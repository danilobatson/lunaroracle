const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Checking and fixing dependencies...');

// Check if node_modules exists and has the required packages
const requiredPackages = [
  '@cloudflare/workers-types',
  '@types/jest',
  'typescript'
];

console.log('📦 Checking installed packages...');
let missingPackages = [];

requiredPackages.forEach(pkg => {
  try {
    const packagePath = `node_modules/${pkg}`;
    if (fs.existsSync(packagePath)) {
      console.log(`✅ ${pkg} found`);
    } else {
      console.log(`❌ ${pkg} missing`);
      missingPackages.push(pkg);
    }
  } catch (error) {
    console.log(`❌ ${pkg} missing`);
    missingPackages.push(pkg);
  }
});

if (missingPackages.length > 0) {
  console.log('\n🔄 Reinstalling missing dependencies...');
  try {
    execSync('yarn install', { stdio: 'inherit' });
    console.log('✅ Dependencies reinstalled');
  } catch (error) {
    console.log('❌ Failed to reinstall dependencies:', error.message);
    process.exit(1);
  }
}

const result = {
  success: true,
  message: 'Dependencies checked and fixed',
  timestamp: new Date().toISOString(),
  packages_checked: requiredPackages,
  missing_packages: missingPackages,
  reinstalled: missingPackages.length > 0
};

console.log('✅ Dependencies fix complete');
fs.writeFileSync('scripts/dependencies-fix-results.json', JSON.stringify(result, null, 2));
