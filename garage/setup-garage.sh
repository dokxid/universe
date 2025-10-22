#!/usr/bin/env sh

# load script pwd
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Load environment variables from .env file
[ ! -f "$SCRIPT_DIR/.env" ] || source "$SCRIPT_DIR/.env"

garage="docker exec -ti garage /garage"

$garage status

# Get node ID from garage status output
GARAGE_NODE_ID=$($garage status | grep -E "^[a-f0-9]{16}" | awk '{print $1}')
echo "Detected Garage Node ID: $GARAGE_NODE_ID"

# init garage node and create bucket
$garage layout assign "${GARAGE_NODE_ID}" -z local -c "${GARAGE_SIZE}" -t "${GARAGE_NODE_NAME}"
$garage layout apply --version 1
$garage bucket create universe

# generate keys
mkdir -p $SCRIPT_DIR/.keys
$garage key create next_server | tee $SCRIPT_DIR/.keys/universe-app
$garage bucket allow \
  --read \
  --write \
  --owner \
  universe \
  --key universe-app

# Extract Key ID and Secret key
KEY_ID=$(grep "Key ID" $SCRIPT_DIR/.keys/universe-app | awk '{print $3}')
SECRET_KEY=$(grep "Secret key" $SCRIPT_DIR/.keys/universe-app | awk '{print $3}')

# Update .env.docker file
ENV_FILE="$SCRIPT_DIR/../.env.docker"

echo "Updating $ENV_FILE with new values..."

# Replace or add the environment variables in .env.docker
sed -i '' "s|^AWS_S3_ENDPOINT=.*|AWS_S3_ENDPOINT=http://garage:$PORT_S3_API|g" $ENV_FILE || echo "AWS_S3_ENDPOINT=http://garage:$PORT_S3_API" >> $ENV_FILE
sed -i '' "s|^AWS_S3_BUCKET_URL=.*|AWS_S3_BUCKET_URL=http://garage:$PORT_S3_API|g" $ENV_FILE || echo "AWS_S3_BUCKET_URL=http://garage:$PORT_S3_API" >> $ENV_FILE
sed -i '' "s|^AWS_REGION=.*|AWS_REGION=garage|g" $ENV_FILE || echo "AWS_REGION=garage" >> $ENV_FILE
sed -i '' "s|^AWS_BUCKET_NAME=.*|AWS_BUCKET_NAME=universe|g" $ENV_FILE || echo "AWS_BUCKET_NAME=universe" >> $ENV_FILE
sed -i '' "s|^AWS_ACCESS_KEY_ID=.*|AWS_ACCESS_KEY_ID=$KEY_ID|g" $ENV_FILE || echo "AWS_ACCESS_KEY_ID=$KEY_ID" >> $ENV_FILE
sed -i '' "s|^AWS_ACCESS_SECRET_KEY=.*|AWS_ACCESS_SECRET_KEY=$SECRET_KEY|g" $ENV_FILE || echo "AWS_ACCESS_SECRET_KEY=$SECRET_KEY" >> $ENV_FILE

echo "Updated $ENV_FILE successfully!"