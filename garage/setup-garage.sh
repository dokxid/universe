#!/usr/bin/env sh

# load script pwd
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Load environment variables from .env file
[ ! -f "$SCRIPT_DIR/../.env" ] || source "$SCRIPT_DIR/../.env"

garage="docker exec -ti garage /garage"
$garage status

# Get node ID from garage status output
GARAGE_NODE_ID=$($garage status | grep -E "^[a-f0-9]{16}" | awk '{print $1}')
echo "Detected Garage Node ID: $GARAGE_NODE_ID"

# init garage node and create bucket
$garage layout assign "${GARAGE_NODE_ID}" -z local -c "${GARAGE_SIZE}" -t "${GARAGE_NODE_NAME}"
$garage layout apply --version 1
$garage bucket create universe-local
$garage bucket create universe-staging
$garage bucket create universe-production

# generate keys
mkdir -p $SCRIPT_DIR/.keys
$garage key delete universe-local --yes
$garage key delete universe-staging --yes
$garage key delete universe-production --yes
$garage key create universe-local | tee $SCRIPT_DIR/.keys/universe-local
$garage bucket allow \
  --read \
  --write \
  --owner \
  universe-local \
  --key universe-local
$garage key create universe-staging | tee $SCRIPT_DIR/.keys/universe-staging
$garage bucket allow \
  --read \
  --write \
  --owner \
  universe-staging \
  --key universe-staging
$garage key create universe-production | tee $SCRIPT_DIR/.keys/universe-production
$garage bucket allow \
  --read \
  --write \
  --owner \
  universe-production \
  --key universe-production

# Extract Key ID and Secret key
KEY_ID_PRODUCTION=$(grep "Key ID" $SCRIPT_DIR/.keys/universe-production | awk '{print $3}')
SECRET_KEY_PRODUCTION=$(grep "Secret key" $SCRIPT_DIR/.keys/universe-production | awk '{print $3}')
KEY_ID_STAGING=$(grep "Key ID" $SCRIPT_DIR/.keys/universe-staging | awk '{print $3}')
SECRET_KEY_STAGING=$(grep "Secret key" $SCRIPT_DIR/.keys/universe-staging | awk '{print $3}')
KEY_ID_LOCAL=$(grep "Key ID" $SCRIPT_DIR/.keys/universe-local | awk '{print $3}')
SECRET_KEY_LOCAL=$(grep "Secret key" $SCRIPT_DIR/.keys/universe-local | awk '{print $3}')

# Update .env.docker file
ENV_FILE_PRODUCTION="$SCRIPT_DIR/../.env.production"
ENV_FILE_STAGING="$SCRIPT_DIR/../.env.staging"
ENV_FILE_LOCAL="$SCRIPT_DIR/../.env"

# replace or add the environment variables in .env.production
echo "Updating $ENV_FILE_PRODUCTION with new values..."
sed -i "s|^AWS_S3_ENDPOINT=.*|AWS_S3_ENDPOINT=http://garage:$PORT_S3_API|g" $ENV_FILE_PRODUCTION || echo "AWS_S3_ENDPOINT=http://garage:$PORT_S3_API" >> $ENV_FILE_PRODUCTION
sed -i "s|^AWS_S3_BUCKET_URL=.*|AWS_S3_BUCKET_URL=http://garage:$PORT_S3_API|g" $ENV_FILE_PRODUCTION || echo "AWS_S3_BUCKET_URL=http://garage:$PORT_S3_API" >> $ENV_FILE_PRODUCTION
sed -i "s|^AWS_ACCESS_KEY_ID=.*|AWS_ACCESS_KEY_ID=$KEY_ID_PRODUCTION|g" $ENV_FILE_PRODUCTION || echo "AWS_ACCESS_KEY_ID=$KEY_ID_PRODUCTION" >> $ENV_FILE_PRODUCTION
sed -i "s|^AWS_SECRET_ACCESS_KEY=.*|AWS_ACCESS_SECRET_KEY=$SECRET_KEY_PRODUCTION|g" $ENV_FILE_PRODUCTION || echo "AWS_ACCESS_SECRET_KEY=$SECRET_KEY_PRODUCTION" >> $ENV_FILE_PRODUCTION
echo "Updated $ENV_FILE_PRODUCTION successfully!"

# replace or add the environment variables in .env.staging
echo "Updating $ENV_FILE_STAGING with new values..."
sed -i "s|^AWS_S3_ENDPOINT=.*|AWS_S3_ENDPOINT=http://garage:$PORT_S3_API|g" $ENV_FILE_STAGING || echo "AWS_S3_ENDPOINT=http://garage:$PORT_S3_API" >> $ENV_FILE_STAGING
sed -i "s|^AWS_S3_BUCKET_URL=.*|AWS_S3_BUCKET_URL=http://garage:$PORT_S3_API|g" $ENV_FILE_STAGING || echo "AWS_S3_BUCKET_URL=http://garage:$PORT_S3_API" >> $ENV_FILE_STAGING
sed -i "s|^AWS_ACCESS_KEY_ID=.*|AWS_ACCESS_KEY_ID=$KEY_ID_STAGING|g" $ENV_FILE_STAGING || echo "AWS_ACCESS_KEY_ID=$KEY_ID_STAGING" >> $ENV_FILE_STAGING
sed -i "s|^AWS_SECRET_ACCESS_KEY=.*|AWS_ACCESS_SECRET_KEY=$SECRET_KEY_STAGING|g" $ENV_FILE_STAGING || echo "AWS_ACCESS_SECRET_KEY=$SECRET_KEY_STAGING" >> $ENV_FILE_STAGING
echo "Updated $ENV_FILE_STAGING successfully!"

# replace or add the environment variables in .env
echo "Updating $ENV_FILE_LOCAL with new values..."
sed -i "s|^AWS_S3_ENDPOINT=.*|AWS_S3_ENDPOINT=http://garage:$PORT_S3_API|g" $ENV_FILE_LOCAL || echo "AWS_S3_ENDPOINT=http://localhost:$PORT_S3_API" >> $ENV_FILE_LOCAL
sed -i "s|^AWS_S3_BUCKET_URL=.*|AWS_S3_BUCKET_URL=http://garage:$PORT_S3_API|g" $ENV_FILE_LOCAL || echo "AWS_S3_BUCKET_URL=http://localhost:$PORT_S3_API" >> $ENV_FILE_LOCAL
sed -i "s|^AWS_ACCESS_KEY_ID=.*|AWS_ACCESS_KEY_ID=$KEY_ID_LOCAL|g" $ENV_FILE_LOCAL || echo "AWS_ACCESS_KEY_ID=$KEY_ID_LOCAL" >> $ENV_FILE_LOCAL
sed -i "s|^AWS_SECRET_ACCESS_KEY=.*|AWS_ACCESS_SECRET_KEY=$SECRET_KEY_LOCAL|g" $ENV_FILE_LOCAL || echo "AWS_ACCESS_SECRET_KEY=$SECRET_KEY_LOCAL" >> $ENV_FILE_LOCAL
echo "Updated $ENV_FILE_LOCAL successfully!"
