#!/usr/bin/env bash

# load script pwd
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Load environment variables from .env file
[ ! -f "$SCRIPT_DIR/../.env.docker" ] || source "$SCRIPT_DIR/../.env.docker"

cat > $SCRIPT_DIR/garage.toml <<EOF
metadata_dir = "/tmp/meta"
data_dir = "/tmp/data"
db_engine = "sqlite"

replication_factor = 1

rpc_bind_addr = "[::]:${PORT_RPC}"
rpc_public_addr = "127.0.0.1:${PORT_RPC}"
rpc_secret = "$(openssl rand -hex 32)"

[s3_api]
s3_region = "garage"
api_bind_addr = "[::]:${PORT_S3_API}"
root_domain = ".s3.garage.localhost"

[s3_web]
bind_addr = "[::]:${PORT_S3_WEB}"
root_domain = ".web.garage.localhost"
index = "index.html"

[k2v_api]
api_bind_addr = "[::]:${PORT_KV2_API}"

[admin]
api_bind_addr = "[::]:${PORT_ADMIN}"
admin_token = "$(openssl rand -base64 32)"
metrics_token = "$(openssl rand -base64 32)"
EOF

echo "generated garage.toml configuration file: $SCRIPT_DIR/garage.toml"
