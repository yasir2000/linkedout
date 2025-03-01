FROM alpine:latest

# Install required dependencies
RUN apk add --no-cache \
    ca-certificates \
    unzip \
    wget

# Download and install PocketBase
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.21.3/pocketbase_0.21.3_linux_amd64.zip \
    && unzip pocketbase_0.21.3_linux_amd64.zip \
    && rm pocketbase_0.21.3_linux_amd64.zip \
    && chmod +x /pocketbase

EXPOSE 8080

CMD ["/pocketbase", "serve", "--http=0.0.0.0:8080"]