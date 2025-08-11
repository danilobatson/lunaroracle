#!/bin/bash
echo "🛠️ Running database migrations..."

# Check if database schema exists
if [ ! -f "database/schema.sql" ]; then
    echo "❌ Database schema file not found at database/schema.sql"
    exit 1
fi

echo "📊 Running migration on Cloudflare D1..."

# Run migration on remote database
if wrangler d1 execute lunarcrush-universal-db --file=database/schema.sql --remote; then
    echo "✅ Database migration completed successfully"
    
    # Create a test SQL file for inserting sample data
    cat > /tmp/test_insert.sql << 'SQL'
INSERT INTO predictions (crypto_symbol, prediction_type, confidence_score, target_change, timeframe_hours, reasoning, galaxy_score, social_dominance, sentiment_spike, expires_at) 
VALUES ('bitcoin', 'bullish', 85, 5.2, 24, 'Test prediction from migration', 75, 20.5, 78, datetime('now', '+24 hours'));
SQL
    
    # Test the database by inserting a test record
    echo "🧪 Testing database with sample data..."
    if wrangler d1 execute lunarcrush-universal-db --file=/tmp/test_insert.sql --remote; then
        echo "✅ Test insert successful"
        
        # Create a test query file
        cat > /tmp/test_query.sql << 'SQL'
SELECT * FROM predictions LIMIT 1;
SQL
        
        echo "📊 Querying test data..."
        wrangler d1 execute lunarcrush-universal-db --file=/tmp/test_query.sql --remote
        
        # Cleanup temp files
        rm -f /tmp/test_insert.sql /tmp/test_query.sql
        
        echo "✅ Database setup and migration complete!"
    else
        echo "⚠️ Test insert failed, but migration completed"
    fi
else
    echo "❌ Database migration failed"
    exit 1
fi
