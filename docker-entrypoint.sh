#!/bin/sh
set -e

echo "Running Prisma DB push..."
npx prisma db push --accept-data-loss

echo "Starting application..."
exec node server.js

