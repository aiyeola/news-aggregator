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

## Set Environment Variables

Run `cp .env.example .env` to create the .env file, fill with appropriate api keys

### Using Docker Compose (Recommended)

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
