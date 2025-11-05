#PostgreSQL + TimescaleDB Docker Setup
Files

- `Dockerfile` - Builds PostgreSQL 14 with TimescaleDB
- `postgresql-compose.yml` - Orchestrates the database container
- `init-timescale.sql` - Enables TimescaleDB extension
- `test-db.sh` - Database validation script

# Build image
docker build -t financial-db .

# Run with Docker
docker run -d \
  --name financial_db \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  financial-db

# Run with Docker Compose
docker-compose up -d

# Test database
docker exec financial_db /test-db.sh

# Connect to database
psql postgresql://postgres:postgres@localhost:5432/financial_platform

# Stop and remove
docker-compose down -v  # -v removes volumes