#!/usr/bin/env bash

# Load environment variables from .env file
[ ! -f .env ] || export $(grep -v '^#' .env | xargs)

cat > ~/.awsrc <<EOF
export AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY}"
export AWS_SECRET_ACCESS_KEY="${AWS_SECRET_KEY}"
export AWS_DEFAULT_REGION='garage'
export AWS_ENDPOINT_URL="${ENDPOINT}"

aws --version
EOF

echo run '~/.awsrc' to initialize the credentials for the current terminal session
source ~/.awsrc
aws s3 ls