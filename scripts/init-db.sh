#!/bin/sh
set -e

echo "Waiting for database to be ready..."
for i in $(seq 1 30); do
  if nc -z postgres 5432; then
    echo "Database is ready"
    break
  fi
  echo "Waiting for database... ($i/30)"
  sleep 1
done

echo "Resetting database..."
npx prisma db push --force-reset

echo "Running database migrations..."
npx prisma db push

echo "Seeding database..."
npx ts-node -P prisma/tsconfig.json prisma/seed.ts

echo "Database initialization completed." 