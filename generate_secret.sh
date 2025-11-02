#!/usr/bin/env sh

# load script pwd
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
  ENV_FILE=$1
if [ $ENV_FILE = "" ]; then
  echo "Usage: generate_secret.sh <.env file path>"
  exit 1
fi

# check if env variables already exist
[ ! -f "$SCRIPT_DIR/$ENV_FILE" ] || source "$SCRIPT_DIR/$ENV_FILE"
if [ -n "${BETTER_AUTH_SECRET}" ]; then echo "aready set secrets in $ENV_FILE"; exit 1; fi

# generate secrets
BETTER_AUTH_SECRET=$(openssl rand -hex 32)

# update .env.docker file
ENV_FILE_PATH="$SCRIPT_DIR/$ENV_FILE"

# replace or add the environment variables in .env
sed -i "s|^BETTER_AUTH_SECRET=.*|BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET|g" $ENV_FILE_PATH || echo "BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET" >> $ENV_FILE_PATH
echo "Updating $ENV_FILE_PATH with new values..."

