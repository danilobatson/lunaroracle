#!/bin/bash
echo "🗄️ Setting up Cloudflare D1 Database..."

# Check if wrangler is authenticated
if ! wrangler whoami &>/dev/null; then
    echo "❌ Not authenticated with Cloudflare"
    echo "🔑 Please run: wrangler auth login"
    exit 1
fi

echo "✅ Authenticated with Cloudflare"

# Create D1 database if it doesn't exist
echo "📊 Creating D1 database 'lunarcrush-universal-db'..."

# Try to create the database
if wrangler d1 create lunarcrush-universal-db --experimental-backend; then
    echo "✅ Database created successfully"
else
    echo "ℹ️ Database may already exist, continuing..."
fi

# List databases to get the ID
echo "📋 Getting database information..."
wrangler d1 list

echo ""
echo "📝 NEXT STEPS:"
echo "1. Copy the database ID from the list above"
echo "2. Update wrangler.toml with the database ID"
echo "3. Run the database migration script"
echo ""
echo "Example wrangler.toml update:"
echo '[[d1_databases]]'
echo 'binding = "DB"'
echo 'database_name = "lunarcrush-universal-db"'
echo 'database_id = "YOUR_DATABASE_ID_HERE"'
