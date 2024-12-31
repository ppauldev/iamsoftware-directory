#!/bin/sh
set -e

MAX_RETRIES=30
RETRY_INTERVAL=1

echo "Waiting for database to be ready..."
wait_for_postgres() {
  for i in $(seq 1 $MAX_RETRIES); do
    if pg_isready -h postgres -p 5432 -U postgres > /dev/null 2>&1; then
      echo "Database is ready"
      return 0
    fi
    
    echo "Attempt $i/$MAX_RETRIES: Database is not ready yet..."
    
    if [ $i -eq $MAX_RETRIES ]; then
      echo "Error: Failed to connect to database after $MAX_RETRIES attempts"
      return 1
    fi
    
    sleep $RETRY_INTERVAL
  done
}

if ! wait_for_postgres; then
  exit 1
fi

echo "Resetting database..."
npx prisma db push --force-reset

echo "Running database migrations..."
npx prisma db push

echo "Seeding database..."
npx ts-node -P prisma/tsconfig.json prisma/seed.ts

echo "Database initialization completed." 