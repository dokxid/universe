#!/bin/sh
set -e

bunx prisma migrate deploy

echo "Starting application..."
exec node server.js
