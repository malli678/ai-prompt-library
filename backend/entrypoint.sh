#!/bin/bash
set -e

echo "Waiting for PostgreSQL (port check)..."

# Step 1: wait until port is open
DB_HOST="${POSTGRES_HOST:-${PGHOST:-db}}"
DB_PORT="${POSTGRES_PORT:-${PGPORT:-5432}}"
while ! nc -z $DB_HOST $DB_PORT; do
  echo "  PostgreSQL port not open yet..."
  sleep 1
done

echo "PostgreSQL port is open."

# Step 2: wait until DB accepts connections
echo "Checking database connection..."

while ! python -c "
import psycopg2, os
psycopg2.connect(
    dbname=os.environ.get('POSTGRES_DB') or os.environ.get('PGDATABASE','promptdb'),
    user=os.environ.get('POSTGRES_USER') or os.environ.get('PGUSER','promptuser'),
    password=os.environ.get('POSTGRES_PASSWORD') or os.environ.get('PGPASSWORD','promptpass'),
    host=os.environ.get('POSTGRES_HOST') or os.environ.get('PGHOST','db'),
    port=os.environ.get('POSTGRES_PORT') or os.environ.get('PGPORT','5432'),
)
" 2>/dev/null; do
  echo "  Database not ready yet..."
  sleep 2
done

echo "PostgreSQL is fully ready."

# Run migrations
echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files for WhiteNoise..."
python manage.py collectstatic --noinput

# Start server with gunicorn (production WSGI)
echo "Starting Django server with gunicorn..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 120