# Docker Configuration Guide

This workspace includes comprehensive Docker support for development, staging, and production environments.

## Quick Start

### Development Environment
```bash
# Copy environment file
cp .env.example .env

# Start development environment
./scripts/docker/deploy.sh development

# Or use Docker Compose directly
docker-compose up -d dev
```

### Production Deployment
```bash
# Copy and configure production environment
cp .env.production .env
# Edit .env with your production settings

# Deploy to production
./scripts/docker/deploy.sh production
```

## Architecture

### Services Overview
- **postgres**: PostgreSQL database with initialization scripts
- **redis**: Redis cache for sessions and caching
- **api**: Backend API service
- **web**: Frontend web application
- **nginx**: Reverse proxy and load balancer (production)
- **dev**: Development container with all tools
- **test**: Test runner container

### Development vs Production

#### Development
- Single container with all development tools
- File watching and hot reload
- Debug logging enabled
- Development database

#### Production
- Multi-container architecture
- Optimized builds
- Load balancing with Nginx
- Health checks and monitoring
- Secure configurations

## File Structure

```
workspace/
├── Dockerfile                    # Multi-stage Dockerfile
├── docker-compose.yml           # Main compose configuration
├── docker-compose.prod.yml      # Production overrides
├── .dockerignore                # Build context exclusions
├── .env.example                 # Development environment template
├── .env.production              # Production environment template
├── .devcontainer/              # VS Code dev container config
│   ├── devcontainer.json
│   └── post-create.sh
├── docker/                     # Docker configuration files
│   ├── nginx.conf              # Development nginx config
│   ├── nginx/
│   │   └── prod.conf           # Production nginx config
│   ├── postgres/
│   │   └── init.sql            # Database initialization
│   └── prometheus/
│       └── prometheus.yml      # Monitoring configuration
└── scripts/docker/             # Management scripts
    ├── deploy.sh               # Deployment script
    └── db-backup.sh            # Database backup/restore
```

## Environment Configuration

### Required Environment Variables

```bash
# Project
PROJECT_NAME=your-project-name

# Database
POSTGRES_DB=your_database
POSTGRES_USER=your_user
POSTGRES_PASSWORD=strong_password

# API
JWT_SECRET=very_strong_jwt_secret
API_PORT=3001

# Web
WEB_PORT=80
```

### Security Considerations

For production, ensure you:
1. Change all default passwords
2. Use strong, unique secrets
3. Configure SSL certificates
4. Set up proper firewall rules
5. Enable monitoring and logging

## Development Container

### VS Code Integration

The workspace includes a complete VS Code dev container configuration:

1. **Open in VS Code**: Use "Reopen in Container" when prompted
2. **Automatic Setup**: Dependencies and tools are installed automatically
3. **Database**: PostgreSQL and Redis are available immediately
4. **Port Forwarding**: All development ports are automatically forwarded

### Features Included
- Node.js 20 with Yarn
- TypeScript and development tools
- Git and GitHub CLI
- Docker-in-Docker support
- VS Code extensions for React, TypeScript, and more

### Manual Setup
```bash
# Start dev container
docker-compose up -d dev

# Access the container
docker-compose exec dev bash

# Install dependencies (if not already done)
yarn install

# Start development servers
yarn dev
```

## Deployment Scripts

### Deploy Script (`./scripts/docker/deploy.sh`)

```bash
# Development
./scripts/docker/deploy.sh development

# Production
./scripts/docker/deploy.sh production

# View status
./scripts/docker/deploy.sh status

# View logs
./scripts/docker/deploy.sh logs

# Stop all services
./scripts/docker/deploy.sh stop

# Clean up everything
./scripts/docker/deploy.sh clean
```

### Database Management (`./scripts/docker/db-backup.sh`)

```bash
# Create backup
./scripts/docker/db-backup.sh backup

# Restore backup
./scripts/docker/db-backup.sh restore backups/backup-file.sql

# List backups
./scripts/docker/db-backup.sh list

# Clean old backups
./scripts/docker/db-backup.sh clean 30

# Show database info
./scripts/docker/db-backup.sh info
```

## Production Deployment

### Prerequisites
1. Docker and Docker Compose installed
2. Domain name configured
3. SSL certificates (Let's Encrypt recommended)
4. Environment variables configured

### Steps
1. **Prepare Environment**
   ```bash
   cp .env.production .env
   # Edit .env with your settings
   ```

2. **Deploy**
   ```bash
   ./scripts/docker/deploy.sh production
   ```

3. **Configure SSL** (if using Let's Encrypt)
   ```bash
   # Install certbot
   docker run -it --rm \
     -v /etc/letsencrypt:/etc/letsencrypt \
     -v /var/lib/letsencrypt:/var/lib/letsencrypt \
     certbot/certbot certonly --standalone \
     -d yourdomain.com
   
   # Copy certificates
   mkdir -p docker/nginx/ssl
   cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem docker/nginx/ssl/cert.pem
   cp /etc/letsencrypt/live/yourdomain.com/privkey.pem docker/nginx/ssl/key.pem
   ```

4. **Restart with SSL**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart nginx
   ```

### Scaling Services

```bash
# Scale API service
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --scale api=3

# Scale web service
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --scale web=2
```

## Monitoring and Logging

### Built-in Monitoring (Optional)
- **Prometheus**: Metrics collection (http://localhost:9090)
- **Grafana**: Visualization dashboard (http://localhost:3002)

```bash
# Start with monitoring
docker-compose --profile monitoring -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Log Management
```bash
# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f api

# Export logs
docker-compose logs --no-color > application.log
```

### Health Checks
All services include health checks:
- API: `/health` endpoint
- Web: HTTP status check
- Database: `pg_isready` check
- Redis: `redis-cli ping` check

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Change port in .env file
   WEB_PORT=3001
   ```

2. **Database Connection Issues**
   ```bash
   # Check database logs
   docker-compose logs postgres
   
   # Test connection
   docker-compose exec postgres psql -U postgres -d idealyst_db
   ```

3. **Build Failures**
   ```bash
   # Clean build cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

4. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   
   # Reset container permissions
   docker-compose down
   docker-compose up -d
   ```

### Debugging

```bash
# Access running container
docker-compose exec api bash
docker-compose exec web sh

# Run commands in container
docker-compose exec api yarn test
docker-compose exec api npm run migrate

# Check service status
docker-compose ps
docker-compose top
```

## Performance Optimization

### Production Optimizations
- Multi-stage builds reduce image size
- Nginx caching for static assets
- Gzip compression enabled
- Connection pooling for database
- Health checks for reliability

### Development Optimizations
- Volume mounts for hot reload
- Development dependencies included
- Debug logging enabled
- File watching optimized

## Security Best Practices

1. **Never commit `.env` files**
2. **Use strong, unique passwords**
3. **Rotate secrets regularly**
4. **Enable SSL in production**
5. **Configure firewalls properly**
6. **Regular security updates**
7. **Monitor logs for suspicious activity**

## Backup and Recovery

### Automated Backups
```bash
# Setup cron job for daily backups
0 2 * * * /path/to/workspace/scripts/docker/db-backup.sh backup
0 3 * * 0 /path/to/workspace/scripts/docker/db-backup.sh clean 30
```

### Disaster Recovery
1. **Data Backup**: Regular database and file backups
2. **Image Registry**: Push images to Docker registry
3. **Configuration Backup**: Version control all configs
4. **Documentation**: Keep deployment notes updated

## Updates and Maintenance

### Updating Services
```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build

# Clean old images
docker image prune
```

### Database Migrations
```bash
# Run migrations
docker-compose exec api yarn migrate

# Rollback if needed
docker-compose exec api yarn migrate:rollback
```
