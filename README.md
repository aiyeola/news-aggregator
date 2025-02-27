# Docker Setup

This documentation provides instructions for running this application within a Docker container.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) (optional but recommended)

## Project Structure

The Docker setup consists of:

- `Dockerfile` - Multi-stage build setup for a production-ready Next.js application
- `docker-compose.yml` - Configuration for easy container management
- `next.config.js` - Next.js configuration with Docker-specific optimizations

## Building and Running with Docker

### Option 1: Using Docker Compose (Recommended)

1. Build and start the container:

   ```bash
   docker compose up --build
   ```

2. Access your application at [http://localhost:3000](http://localhost:3000)

3. To run in detached mode (in the background):

   ```bash
   docker compose up -d
   ```

4. To stop the container:
   ```bash
   docker compose down
   ```

### Option 2: Using Docker Commands

1. Build the Docker image:

   ```bash
   docker build -t nextjs-app .
   ```

2. Run the container:

   ```bash
   docker run -p 3000:3000 nextjs-app
   ```

3. Access your application at [http://localhost:3000](http://localhost:3000)

## Development Workflow

For development with hot reloading, you can create a development-specific Docker setup by adding the following to your docker-compose.yml:

```yaml
services:
  nextjs-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev # Create a separate development Dockerfile
    ports:
      - '3000:3000'
    volumes:
      - .:/app # Mount your codebase for hot reloading
      - /app/node_modules # Don't override node_modules
    command: npm run dev
```

## Environment Variables

Environment variables can be managed in several ways:

1. In `docker-compose.yml` under the `environment` section
2. Using a `.env` file and the `env_file` option in docker-compose
3. At runtime with the `-e` flag when using `docker run`

Example of using an env file with docker-compose:

```yaml
services:
  nextjs:
    env_file:
      - .env.production
```

## Optimizations

The current setup includes several optimizations:

1. **Multi-stage builds** to keep the final image small
2. **Non-root user** for better security
3. **Standalone output** mode from Next.js for optimized container size
4. **Alpine-based** Node.js image for a smaller footprint

## Troubleshooting

### Container fails to start

- Check logs: `docker logs <container_id>`
- Verify your Next.js application works outside of Docker
- Ensure ports are correctly mapped and not in use

### Application is slow or unresponsive

- Increase Docker resource allocation in Docker Desktop settings
- Consider optimizing your Next.js application for production

### File changes not reflecting

- For production builds, you need to rebuild the Docker image
- For development, ensure volumes are correctly mounted
