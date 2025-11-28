#!/bin/bash
# setup-database.sh

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL client (psql) is not installed. Please install PostgreSQL first."
    exit 1
fi

# Check if the database exists, if not, create it
echo "Checking if database exists..."
if psql postgres -tAc "SELECT 1 FROM pg_database WHERE datname='whs_todolist'" | grep -q 1; then
    echo "Database whs_todolist already exists"
else
    echo "Creating database whs_todolist..."
    createdb whs_todolist
    echo "Database created successfully"
fi

# Run the schema file
echo "Running schema.sql..."
psql -d whs_todolist -f ../database/schema.sql
echo "Schema applied successfully"

echo "Database setup complete!"