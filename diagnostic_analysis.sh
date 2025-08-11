#!/bin/bash

# LunarOracle Comprehensive Diagnostic Script
# This script analyzes the current state of the LunarOracle codebase
# and outputs diagnostic information to JSON files

# Step 1: Navigate to project directory
echo "🔍 Starting LunarOracle Diagnostic Analysis"
echo "=========================================="
echo ""

# You'll need to update this path to your actual project location
cd /Users/batson/Desktop/ForTheNerds/CreatorBid/lunaroracle || {
    echo "❌ Project directory not found. Please update the path in the script."
    echo "Current directory: $(pwd)"
    echo "Please run: cd /path/to/your/lunaroracle/project"
    exit 1
}

echo "✅ Current directory: $(pwd)"
echo ""

# Create diagnostics directory if it doesn't exist
mkdir -p diagnostics

# Step 2: Project Structure Analysis
echo "📁 STEP 1: Analyzing Project Structure"
echo "====================================="

cat > diagnostics/project_structure.json << 'EOJSON'
{
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "project_root": "$(pwd)",
    "directory_structure": {
EOJSON

# Get directory tree structure
echo "        \"src_structure\": [" >> diagnostics/project_structure.json
find src -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | head -50 | while read file; do
    echo "            \"$file\"," >> diagnostics/project_structure.json
done
# Remove trailing comma
python3 -c "
import sys
with open('diagnostics/project_structure.json', 'r') as f:
    content = f.read().rstrip().rstrip(',')
with open('diagnostics/project_structure.json', 'w') as f:
    f.write(content)
"

echo "        ]," >> diagnostics/project_structure.json
echo "        \"api_routes\": [" >> diagnostics/project_structure.json

# Get API routes
find src/app/api -name "route.ts" -o -name "route.js" 2>/dev/null | while read route; do
    echo "            \"$route\"," >> diagnostics/project_structure.json
done
# Remove trailing comma if any routes found
if [ -d "src/app/api" ]; then
    python3 -c "
import sys
with open('diagnostics/project_structure.json', 'r') as f:
    content = f.read().rstrip().rstrip(',')
with open('diagnostics/project_structure.json', 'w') as f:
    f.write(content)
"
fi

echo "        ]," >> diagnostics/project_structure.json
echo "        \"lib_files\": [" >> diagnostics/project_structure.json

# Get lib files
if [ -d "src/lib" ]; then
    find src/lib -name "*.ts" -o -name "*.js" | while read lib; do
        echo "            \"$lib\"," >> diagnostics/project_structure.json
    done
    python3 -c "
import sys
with open('diagnostics/project_structure.json', 'r') as f:
    content = f.read().rstrip().rstrip(',')
with open('diagnostics/project_structure.json', 'w') as f:
    f.write(content)
"
fi

echo "        ]" >> diagnostics/project_structure.json
echo "    }" >> diagnostics/project_structure.json
echo "}" >> diagnostics/project_structure.json

echo "✅ Project structure saved to diagnostics/project_structure.json"

# Step 3: Package Dependencies Analysis
echo ""
echo "📦 STEP 2: Analyzing Dependencies"
echo "==============================="

if [ -f "package.json" ]; then
    cat > diagnostics/dependencies.json << EOJSON
{
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "package_manager": "$(which yarn >/dev/null && echo 'yarn' || echo 'npm')",
    "node_version": "$(node --version 2>/dev/null || echo 'not_found')",
    "yarn_version": "$(yarn --version 2>/dev/null || echo 'not_found')",
EOJSON

    echo "    \"package_json\": $(cat package.json)," >> diagnostics/dependencies.json
    echo "    \"lock_file_exists\": $([ -f "yarn.lock" ] && echo "true" || echo "false")," >> diagnostics/dependencies.json
    echo "    \"node_modules_exists\": $([ -d "node_modules" ] && echo "true" || echo "false")" >> diagnostics/dependencies.json
    echo "}" >> diagnostics/dependencies.json

    echo "✅ Dependencies info saved to diagnostics/dependencies.json"
else
    echo "❌ package.json not found"
    cat > diagnostics/dependencies.json << EOJSON
{
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "error": "package.json not found",
    "current_directory": "$(pwd)"
}
EOJSON
fi

# Step 4: Environment Variables Check (without exposing sensitive data)
echo ""
echo "🔐 STEP 3: Environment Variables Check"
echo "===================================="

cat > diagnostics/environment.json << EOJSON
{
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "env_files": {
        ".env.local_exists": $([ -f ".env.local" ] && echo "true" || echo "false"),
        ".env_exists": $([ -f ".env" ] && echo "true" || echo "false"),
        ".env.example_exists": $([ -f ".env.example" ] && echo "true" || echo "false")
    },
    "environment_variables": {
EOJSON

# Check for required environment variables without exposing values
ENV_VARS=("LUNARCRUSH_API_KEY" "GEMINI_API_KEY" "CLOUDFLARE_ACCOUNT_ID" "CLOUDFLARE_D1_DATABASE_ID" "CLOUDFLARE_API_TOKEN" "ENVIRONMENT")

for var in "${ENV_VARS[@]}"; do
    if [[ -n "${!var}" ]]; then
        status="set"
        length=${#!var}
    elif grep -q "^$var=" .env.local 2>/dev/null; then
        status="in_env_local"
        length=$(grep "^$var=" .env.local | cut -d'=' -f2 | wc -c)
    elif grep -q "^$var=" .env 2>/dev/null; then
        status="in_env_file"
        length=$(grep "^$var=" .env | cut -d'=' -f2 | wc -c)
    else
        status="missing"
        length=0
    fi

    echo "        \"$var\": {\"status\": \"$status\", \"length\": $length}," >> diagnostics/environment.json
done

# Remove trailing comma
python3 -c "
import sys
with open('diagnostics/environment.json', 'r') as f:
    content = f.read().rstrip().rstrip(',')
with open('diagnostics/environment.json', 'w') as f:
    f.write(content)
"

echo "    }" >> diagnostics/environment.json
echo "}" >> diagnostics/environment.json

echo "✅ Environment check saved to diagnostics/environment.json"

# Step 5: Code Analysis
echo ""
echo "💻 STEP 4: Code Analysis"
echo "======================"

cat > diagnostics/code_analysis.json << EOJSON
{
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
EOJSON

if [ -f "tsconfig.json" ]; then
    echo "    \"typescript_config\": $(cat tsconfig.json)," >> diagnostics/code_analysis.json
else
    echo "    \"typescript_config\": null," >> diagnostics/code_analysis.json
fi

echo "    \"next_config\": $([ -f "next.config.js" ] && echo "\"exists\"" || [ -f "next.config.mjs" ] && echo "\"exists\"" || echo "null")," >> diagnostics/code_analysis.json
echo "    \"tailwind_config\": $([ -f "tailwind.config.js" ] && echo "\"exists\"" || [ -f "tailwind.config.ts" ] && echo "\"exists\"" || echo "null")," >> diagnostics/code_analysis.json
echo "    \"api_routes_count\": $(find src/app/api -name "route.ts" 2>/dev/null | wc -l | tr -d ' ')," >> diagnostics/code_analysis.json
echo "    \"lib_services\": [" >> diagnostics/code_analysis.json

# Analyze lib services
if [ -d "src/lib" ]; then
    find src/lib -name "*.ts" -o -name "*.js" | while read lib_file; do
        filename=$(basename "$lib_file")
        echo "        {" >> diagnostics/code_analysis.json
        echo "            \"file\": \"$lib_file\"," >> diagnostics/code_analysis.json
        echo "            \"name\": \"$filename\"," >> diagnostics/code_analysis.json
        echo "            \"exports\": [" >> diagnostics/code_analysis.json

        # Extract export statements (simplified)
        grep -E "^export " "$lib_file" 2>/dev/null | head -10 | while read export_line; do
            echo "                \"$(echo "$export_line" | tr '"' "'" | python3 -c "import sys; print(sys.stdin.read().strip().rstrip(','))")\"," >> diagnostics/code_analysis.json
        done
        python3 -c "
import sys
with open('diagnostics/code_analysis.json', 'r') as f:
    content = f.read().rstrip().rstrip(',')
with open('diagnostics/code_analysis.json', 'w') as f:
    f.write(content)
"

        echo "            ]" >> diagnostics/code_analysis.json
        echo "        }," >> diagnostics/code_analysis.json
    done
    python3 -c "
import sys
with open('diagnostics/code_analysis.json', 'r') as f:
    content = f.read().rstrip().rstrip(',')
with open('diagnostics/code_analysis.json', 'w') as f:
    f.write(content)
"
fi

echo "    ]" >> diagnostics/code_analysis.json
echo "}" >> diagnostics/code_analysis.json

echo "✅ Code analysis saved to diagnostics/code_analysis.json"

# Step 6: Build Test
echo ""
echo "🔨 STEP 5: Build Test"
echo "=================="

echo "Running build test..."
if command -v yarn >/dev/null; then
    yarn build > diagnostics/build_output.log 2>&1
    BUILD_EXIT_CODE=$?
else
    npm run build > diagnostics/build_output.log 2>&1
    BUILD_EXIT_CODE=$?
fi

cat > diagnostics/build_status.json << EOJSON
{
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "build_success": $([ $BUILD_EXIT_CODE -eq 0 ] && echo "true" || echo "false"),
    "exit_code": $BUILD_EXIT_CODE,
    "build_output": "$(cat diagnostics/build_output.log | tail -20 | python3 -c "import sys, json; print(json.dumps(sys.stdin.read()))" | tr -d '"')",
    "build_directory_exists": $([ -d ".next" ] && echo "true" || echo "false")
}
EOJSON

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo "✅ Build test passed"
else
    echo "❌ Build test failed (exit code: $BUILD_EXIT_CODE)"
fi

echo "✅ Build status saved to diagnostics/build_status.json"

# Step 7: Git Status
echo ""
echo "📊 STEP 6: Git Repository Status"
echo "==============================="

cat > diagnostics/git_status.json << EOJSON
{
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "is_git_repo": $([ -d ".git" ] && echo "true" || echo "false"),
    "current_branch": "$(git branch --show-current 2>/dev/null || echo 'unknown')",
    "remote_origin": "$(git remote get-url origin 2>/dev/null || echo 'none')",
    "last_commit": "$(git log -1 --oneline 2>/dev/null || echo 'none')",
    "uncommitted_changes": $(git status --porcelain 2>/dev/null | wc -l | tr -d ' '),
    "gitignore_exists": $([ -f ".gitignore" ] && echo "true" || echo "false")
}
EOJSON

echo "✅ Git status saved to diagnostics/git_status.json"

# Step 8: Summary Report
echo ""
echo "📋 STEP 7: Creating Summary Report"
echo "================================="

cat > diagnostics/diagnostic_summary.json << EOJSON
{
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "diagnostic_version": "1.0.0",
    "project_name": "LunarOracle",
    "analysis_complete": true,
    "files_generated": [
        "diagnostics/project_structure.json",
        "diagnostics/dependencies.json",
        "diagnostics/environment.json",
        "diagnostics/code_analysis.json",
        "diagnostics/build_status.json",
        "diagnostics/git_status.json",
        "diagnostics/diagnostic_summary.json"
    ],
    "next_steps": [
        "Review all diagnostic JSON files",
        "Upload diagnostic files to conversation",
        "Identify areas for enhancement",
        "Plan implementation strategy"
    ],
    "ready_for_analysis": true
}
EOJSON

echo "✅ Summary report saved to diagnostics/diagnostic_summary.json"

# Final Output
echo ""
echo "🎉 DIAGNOSTIC ANALYSIS COMPLETE"
echo "=============================="
echo ""
echo "📁 Generated Files:"
ls -la diagnostics/*.json
echo ""
echo "📤 Next Steps:"
echo "1. Upload all JSON files from the diagnostics/ directory to the conversation"
echo "2. I'll analyze the current state and recommend enhancement strategies"
echo "3. We'll implement advanced AI features step by step"
echo ""
echo "🔍 To view any specific diagnostic:"
echo "cat diagnostics/project_structure.json"
echo "cat diagnostics/dependencies.json"
echo "cat diagnostics/environment.json"
echo "cat diagnostics/code_analysis.json"
echo "cat diagnostics/build_status.json"
echo "cat diagnostics/git_status.json"
echo ""
echo "✅ Ready for enhancement planning!"
