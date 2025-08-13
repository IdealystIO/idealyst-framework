#!/bin/bash

# Docker deployment script for Idealyst workspace
# Usage: ./scripts/docker/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME=${PROJECT_NAME:-idealyst}

echo "🚀 Deploying Idealyst to $ENVIRONMENT environment..."

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
    echo "❌ Invalid environment. Use: development, staging, or production"
    exit 1
fi

# Check if required files exist
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found. Run this script from the project root."
    exit 1
fi

if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env with your configuration before proceeding."
    exit 1
fi

# Source environment variables
source .env

# Function to wait for service health
wait_for_service() {
    local service=$1
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Waiting for $service to be healthy..."
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose ps $service | grep -q "healthy\|Up"; then
            echo "✅ $service is ready"
            return 0
        fi
        
        echo "🔄 Attempt $attempt/$max_attempts - waiting for $service..."
        sleep 10
        attempt=$((attempt + 1))
    done
    
    echo "❌ $service failed to become healthy"
    return 1
}

# Function to run database migrations
run_migrations() {
    echo "🗄️ Running database migrations..."
    
    # Check if any package has Prisma schema
    for package_dir in packages/*/; do
        if [ -f "${package_dir}prisma/schema.prisma" ]; then
            echo "📦 Running migrations for $(basename "$package_dir")..."
            docker-compose exec api yarn workspace $(basename "$package_dir") prisma migrate deploy
        fi
    done
}

# Function to build and deploy
deploy() {
    case $ENVIRONMENT in
        "development")
            echo "🔧 Starting development environment..."
            docker-compose up --build -d postgres redis
            wait_for_service postgres
            wait_for_service redis
            docker-compose up --build -d dev
            ;;
            
        "staging"|"production")
            echo "🏗️ Building application..."
            docker-compose build --no-cache
            
            if [ "$ENVIRONMENT" = "production" ]; then
                echo "🚀 Deploying to production..."
                docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d postgres redis
            else
                echo "🧪 Deploying to staging..."
                docker-compose up -d postgres redis
            fi
            
            wait_for_service postgres
            wait_for_service redis
            
            # Run migrations
            run_migrations
            
            if [ "$ENVIRONMENT" = "production" ]; then
                docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d api web nginx
            else
                docker-compose up -d api web
            fi
            
            wait_for_service api
            wait_for_service web
            ;;
    esac
}

# Function to show deployment status
show_status() {
    echo ""
    echo "📊 Deployment Status:"
    echo "===================="
    docker-compose ps
    
    echo ""
    echo "🌐 Service URLs:"
    echo "==============="
    
    if [ "$ENVIRONMENT" = "development" ]; then
        echo "Web App (Dev): http://localhost:3000"
        echo "API (Dev): http://localhost:3001"
        echo "Database: postgresql://postgres:postgres@localhost:5432/${POSTGRES_DB}"
        echo "Redis: redis://localhost:6379"
    else
        echo "Web App: http://localhost:${WEB_PORT:-80}"
        echo "API: http://localhost:${API_PORT:-3001}"
        
        if [ "$ENVIRONMENT" = "production" ]; then
            echo "Nginx: http://localhost"
            echo "Monitoring: http://localhost:3002 (Grafana)"
            echo "Metrics: http://localhost:9090 (Prometheus)"
        fi
    fi
    
    echo ""
    echo "📝 Logs:"
    echo "========"
    echo "View logs: docker-compose logs -f [service]"
    echo "Available services: $(docker-compose config --services | tr '\n' ' ')"
}

# Function to run tests
run_tests() {
    echo "🧪 Running tests..."
    docker-compose --profile testing run --rm test
}

# Main deployment process
main() {
    echo "🏗️ Environment: $ENVIRONMENT"
    echo "📦 Project: $PROJECT_NAME"
    echo ""
    
    # Stop existing containers
    echo "🛑 Stopping existing containers..."
    docker-compose down
    
    # Clean up orphaned containers
    docker-compose down --remove-orphans
    
    # Deploy
    deploy
    
    # Show status
    show_status
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "💡 Useful commands:"
    echo "  View logs: docker-compose logs -f"
    echo "  Stop services: docker-compose down"
    echo "  Restart service: docker-compose restart [service]"
    echo "  Run tests: ./scripts/docker/deploy.sh test"
    echo ""
}

# Handle special commands
case $ENVIRONMENT in
    "test")
        run_tests
        exit 0
        ;;
    "status")
        show_status
        exit 0
        ;;
    "logs")
        docker-compose logs -f
        exit 0
        ;;
    "stop")
        echo "🛑 Stopping all services..."
        docker-compose down
        echo "✅ All services stopped"
        exit 0
        ;;
    "clean")
        echo "🧹 Cleaning up Docker resources..."
        docker-compose down -v --remove-orphans
        docker system prune -f
        echo "✅ Cleanup complete"
        exit 0
        ;;
esac

# Run main deployment
main
