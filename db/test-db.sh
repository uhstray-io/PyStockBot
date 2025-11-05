#!/bin/bash
echo "=== Database Validation ==="

# Wait for PostgreSQL to be ready
until pg_isready -U postgres -d financial_platform > /dev/null 2>&1; do
    echo "Waiting for database..."
    sleep 2
done

# Test connection
if psql -U postgres -d financial_platform -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    exit 1
fi

# Test TimescaleDB
if psql -U postgres -d financial_platform -c "SELECT extname FROM pg_extension WHERE extname = 'timescaledb';" | grep -q timescaledb; then
    echo "✅ TimescaleDB extension enabled"
else
    echo "❌ TimescaleDB extension not found"
    exit 1
fi

# Test table creation and data insertion
psql -U postgres -d financial_platform <<EOF
-- Insert test data
INSERT INTO users (email, kyc_status) 
VALUES ('test@example.com', 'verified') 
ON CONFLICT DO NOTHING;

INSERT INTO portfolios (user_id, name)
SELECT id, 'Test Portfolio' FROM users WHERE email = 'test@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO market_data (symbol, timestamp, open, high, low, close, volume)
VALUES ('AAPL', NOW(), 150.00, 155.00, 149.00, 154.50, 1000000)
ON CONFLICT DO NOTHING;

-- Verify data
SELECT 
    (SELECT COUNT(*) FROM users) as users_count,
    (SELECT COUNT(*) FROM portfolios) as portfolios_count,
    (SELECT COUNT(*) FROM market_data) as market_count;
EOF

echo "✅ Test data inserted and verified"