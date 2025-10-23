#!/bin/bash

# Start MongoDB in replica set mode as a background task
mongod --port "$MONGO_REPLICA_PORT" --replSet rs0 --bind_ip 0.0.0.0 &
MONGOD_PID=$!

# Prepare the replica set with a single node and root user configuration
INIT_REPL_CMD="rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: '$MONGO_REPLICA_HOST:$MONGO_REPLICA_PORT' }] })"

# Wait for the replica set to be ready and then submit the command
until ($MONGO_COMMAND admin --port "$MONGO_REPLICA_PORT" --eval "$INIT_REPL_CMD"); do
    sleep 1
done

# Keep the container running by waiting on signals from the MongoDB task
echo "REPLICA SET ONLINE"
wait $MONGOD_PID
