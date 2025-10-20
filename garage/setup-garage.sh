#!/usr/bin/env sh

# Load environment variables from .env file
[ ! -f .env ] || export $(grep -v '^#' .env | xargs)

set -x

garage="docker exec -ti garage /garage"

$garage status

# Get node ID from garage status output
GARAGE_NODE_ID=$($garage status | grep -E "^[a-f0-9]{16}" | awk '{print $1}')
echo "Detected Garage Node ID: $GARAGE_NODE_ID"

$garage layout assign "${GARAGE_NODE_ID}" -z local -c "${GARAGE_SIZE}" -t "${GARAGE_NODE_NAME}"
$garage layout apply --version 1

$garage bucket create universe
$garage key create next_server | tee keys/.next_server
$garage bucket allow \
  --read \
  --write \
  --owner \
  universe \
  --key next_server
$garage key create aws_cli | tee keys/.aws_cli
$garage bucket allow \
  --read \
  --write \
  --owner \
  universe \
  --key aws_cli