const fs = require('fs');

function runIntegrationTest() {
  console.log('🔗 Running integration test suite...');
  
  const testFiles = [
    'scripts/typescript-test-results.json',
    'scripts/environment-test-results.json', 
    'scripts/lunarcrush-test-results.json',
    'scripts/gemini-test-results.json'
  ];
  
  const results = {
    timestamp: new Date().toISOString(),
    tests: {},
    overall_success: true,
    ready_for_next_phase: true
  };
  
  testFiles.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        const testData = JSON.parse(fs.readFileSync(file, 'utf8'));
        const testName = file.replace('scripts/', '').replace('-test-results.json', '');
        results.tests[testName] = testData;
        
        if (!testData.success) {
          results.overall_success = false;
          results.ready_for_next_phase = false;
        }
      } catch (error) {
        results.tests[file] = { success: false, error: 'Failed to read test file' };
        results.overall_success = false;
        results.ready_for_next_phase = false;
      }
    } else {
      results.tests[file] = { success: false, error: 'Test file not found' };
      results.overall_success = false;
      results.ready_for_next_phase = false;
    }
  });
  
  if (results.overall_success) {
    console.log('✅ All integration tests passed - Ready for next phase!');
  } else {
    console.log('❌ Some tests failed - Review individual test results');
  }
  
  fs.writeFileSync('scripts/integration-test-results.json', JSON.stringify(results, null, 2));
}

runIntegrationTest();
