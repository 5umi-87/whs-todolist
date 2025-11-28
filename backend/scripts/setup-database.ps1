# setup-database.ps1

# Check if psql is available
if (!(Get-Command psql -ErrorAction SilentlyContinue)) {
    Write-Host "PostgreSQL client (psql) is not installed or not in PATH. Please install PostgreSQL first."
    exit 1
}

# Check if the database exists, if not, create it
Write-Host "Checking if database exists..."
try {
    $result = psql -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='whs_todolist'" 2>$null
    if ($result -eq "1") {
        Write-Host "Database whs_todolist already exists"
    } else {
        Write-Host "Creating database whs_todolist..."
        createdb whs_todolist
        Write-Host "Database created successfully"
    }
    
    # Run the schema file
    Write-Host "Running schema.sql..."
    psql -d whs_todolist -f ..\database\schema.sql
    Write-Host "Schema applied successfully"
    
    Write-Host "Database setup complete!"
} catch {
    Write-Host "Error setting up database: $($_.Exception.Message)"
    exit 1
}