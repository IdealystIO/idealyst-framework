#!/bin/bash

# Quick setup script for Idealyst workspace
# Usage: ./setup.sh [development|production]

set -e

ENVIRONMENT=${1:-development}
PROJECT_NAME="{{packageName}}"

echo "🚀 Setting up Idealyst workspace..."
echo "Environment: $ENVIRONMENT"
echo "Project: $PROJECT_NAME"
echo ""

# Function to generate random password
generate_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-25
}

# Function to generate JWT secret
generate_jwt_secret() {
    openssl rand -base64 64 | tr -d "=+/" | cut -c1-50
}

# Function to setup development environment
setup_development() {
    echo "🔧 Setting up development environment..."
    
    if [ ! -f ".env" ]; then
        echo "📝 Creating .env from template..."
        cp .env.example .env
        echo "✅ Created .env file"
    else
        echo "⚠️  .env file already exists, skipping..."
    fi
    
    echo ""
    echo "🐳 Starting development containers..."
    if command -v docker-compose &> /dev/null; then
        docker-compose up -d postgres redis
        echo "✅ Database and Redis started"
        
        echo "⏳ Waiting for services to be ready..."
        sleep 10
        
        echo "🚀 Starting development environment..."
        echo "💡 You can now:"
        echo "   - Run 'docker-compose up -d dev' for full dev container"
        echo "   - Run 'yarn dev' for local development"
        echo "   - Open in VS Code and select 'Reopen in Container'"
    else
        echo "❌ Docker Compose not found. Please install Docker and Docker Compose."
        exit 1
    fi
}

# Function to setup production environment
setup_production() {
    echo "🏭 Setting up production environment..."
    
    if [ ! -f ".env" ]; then
        echo "📝 Creating .env from production template..."
        cp .env.production .env
        
        # Generate secure passwords and secrets
        echo "🔐 Generating secure credentials..."
        
        DB_PASSWORD=$(generate_password)
        JWT_SECRET=$(generate_jwt_secret)
        SESSION_SECRET=$(generate_jwt_secret)
        ENCRYPTION_KEY=$(openssl rand -base64 32 | cut -c1-32)
        GRAFANA_PASSWORD=$(generate_password)
        
        # Replace placeholders in .env file
        sed -i "s/CHANGE_THIS_STRONG_PASSWORD/$DB_PASSWORD/g" .env
        sed -i "s/CHANGE_THIS_VERY_STRONG_JWT_SECRET_MINIMUM_32_CHARACTERS/$JWT_SECRET/g" .env
        sed -i "s/CHANGE_THIS_VERY_STRONG_SESSION_SECRET/$SESSION_SECRET/g" .env
        sed -i "s/CHANGE_THIS_32_CHARACTER_ENCRYPTION_KEY/$ENCRYPTION_KEY/g" .env
        sed -i "s/CHANGE_THIS_STRONG_PASSWORD/$GRAFANA_PASSWORD/g" .env
        
        echo "✅ Created .env with secure credentials"
        echo ""
        echo "🔐 Generated Credentials (save these securely!):"
        echo "   Database Password: $DB_PASSWORD"
        echo "   JWT Secret: $JWT_SECRET"
        echo "   Grafana Password: $GRAFANA_PASSWORD"
        echo ""
        echo "⚠️  IMPORTANT: Edit .env to configure your domain and other settings!"
        
    else
        echo "⚠️  .env file already exists. Please verify production settings."
    fi
    
    echo ""
    echo "📋 Production Checklist:"
    echo "  [ ] Edit .env with your domain name"
    echo "  [ ] Configure SSL certificates"
    echo "  [ ] Set up DNS records"
    echo "  [ ] Configure firewall rules"
    echo "  [ ] Set up monitoring (optional)"
    echo ""
    echo "🚀 Deploy with: ./scripts/docker/deploy.sh production"
}

# Function to check prerequisites
check_prerequisites() {
    echo "🔍 Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker not found. Please install Docker."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose not found. Please install Docker Compose."
        exit 1
    fi
    
    # Check if Docker is running
    if ! docker info &> /dev/null; then
        echo "❌ Docker is not running. Please start Docker."
        exit 1
    fi
    
    echo "✅ Prerequisites check passed"
    echo ""
}

# Function to show post-setup instructions
show_instructions() {
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "Next steps:"
    
    if [ "$ENVIRONMENT" = "development" ]; then
        echo "  1. Install dependencies: yarn install"
        echo "  2. Start development:"
        echo "     - Full container: docker-compose up -d dev"
        echo "     - VS Code: Open in Container"
        echo "     - Local: yarn dev"
        echo "  3. Access your app:"
        echo "     - Web: http://localhost:3000"
        echo "     - API: http://localhost:3001"
        echo "     - Database: postgresql://postgres:postgres@localhost:5432/idealyst_db"
    else
        echo "  1. Edit .env with your production settings"
        echo "  2. Configure SSL certificates"
        echo "  3. Deploy: ./scripts/docker/deploy.sh production"
        echo "  4. Set up monitoring (optional)"
    fi
    
    echo ""
    echo "📚 Documentation:"
    echo "  - DOCKER.md - Complete Docker guide"
    echo "  - TESTING.md - Testing documentation"
    echo "  - README.md - General workspace info"
    echo ""
    echo "🆘 Need help? Check the documentation or run:"
    echo "  ./scripts/docker/deploy.sh --help"
}

# Main setup process
main() {
    check_prerequisites
    
    case $ENVIRONMENT in
        "development"|"dev")
            setup_development
            ;;
        "production"|"prod")
            setup_production
            ;;
        *)
            echo "❌ Invalid environment. Use 'development' or 'production'"
            echo "Usage: $0 [development|production]"
            exit 1
            ;;
    esac
    
    show_instructions
}

# Handle help
if [[ "$1" == "--help" ]] || [[ "$1" == "-h" ]] || [[ "$1" == "help" ]]; then
    echo "Idealyst Workspace Setup Script"
    echo ""
    echo "Usage: $0 [environment]"
    echo ""
    echo "Environments:"
    echo "  development (default) - Set up for local development"
    echo "  production           - Set up for production deployment"
    echo ""
    echo "Examples:"
    echo "  $0                   # Development setup"
    echo "  $0 development       # Development setup"
    echo "  $0 production        # Production setup"
    echo ""
    exit 0
fi

main
