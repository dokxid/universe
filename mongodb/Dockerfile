ARG MONGO_VERSION=8

FROM mongo:${MONGO_VERSION}

# Copy the initialization script into the container
COPY init-replica.sh /usr/local/bin/init-replica.sh
RUN chmod +x /usr/local/bin/init-replica.sh

# Use JSON syntax for ENTRYPOINT
ENTRYPOINT ["bash", "/usr/local/bin/init-replica.sh"]