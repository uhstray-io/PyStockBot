FROM postgres:14

# Install TimescaleDB
RUN apt-get update && \
    apt-get install -y postgresql-14-timescaledb && \
    rm -rf /var/lib/apt/lists/*

# Configure PostgreSQL for TimescaleDB
RUN echo "shared_preload_libraries = 'timescaledb'" >> /usr/share/postgresql/14/postgresql.conf.sample

# Set environment variables
ENV POSTGRES_DB=financial_platform
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Copy initialization files
COPY init/schema.sql /docker-entrypoint-initdb.d/01-schema.sql
COPY init/timescale.sql /docker-entrypoint-initdb.d/00-timescale.sql
COPY test-db.sh /test-db.sh

# Make test script executable
RUN chmod +x /test-db.sh

# Expose PostgreSQL port
EXPOSE 5432

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
    CMD pg_isready -U postgres -d financial_platform