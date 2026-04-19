#!/bin/bash
set -e

echo "Waiting for PostgreSQL (port check)..."

# Step 1: wait until port is open
while ! nc -z $POSTGRES_HOST 5432; do
  echo "  PostgreSQL port not open yet..."
  sleep 1
done

echo "PostgreSQL port is open."

# Step 2: wait until DB accepts connections
echo "Checking database connection..."

while ! python -c "
import psycopg2, os
psycopg2.connect(
    dbname=os.environ.get('POSTGRES_DB','promptdb'),
    user=os.environ.get('POSTGRES_USER','promptuser'),
    password=os.environ.get('POSTGRES_PASSWORD','promptpass'),
    host=os.environ.get('POSTGRES_HOST','db'),
    port=os.environ.get('POSTGRES_PORT','5432'),
)
" 2>/dev/null; do
  echo "  Database not ready yet..."
  sleep 2
done

echo "PostgreSQL is fully ready."

# Run migrations
echo "Running migrations..."
python manage.py migrate --noinput

# Start server with gunicorn (production WSGI)
echo "Starting Django server with gunicorn..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2 --timeout 120