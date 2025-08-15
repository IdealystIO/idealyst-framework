#!/bin/bash

# Docker build helper script for Idealyst workspace
# Handles common issues like missing yarn.lock files

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 Idealyst Docker Build Helper${NC}"
echo ""

# Check if yarn.lock exists
if [ ! -f "yarn.lock" ]; then
    echo -e "${YELLOW}⚠️  yarn.lock not found${NC}"
    echo "This can cause Docker build failures with 'immutable' installs."
    echo ""
    read -p "Would you like to generate yarn.lock now? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}📦 Installing dependencies to generate yarn.lock...${NC}"
        yarn install
        echo -e "${GREEN}✅ yarn.lock generated${NC}"
    else
        echo -e "${YELLOW}⚠️  Continuing without yarn.lock (may cause build issues)${NC}"
    fi
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    if [ -f ".env.example" ]; then
        read -p "Would you like to copy .env.example to .env? (y/N): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cp .env.example .env
            echo -e "${GREEN}✅ .env file created from .env.example${NC}"
            echo -e "${YELLOW}📝 Please review and update .env with your settings${NC}"
        fi
    else
        echo -e "${YELLOW}📝 Please create a .env file with your configuration${NC}"
    fi
    echo ""
fi

# Determine what to build
if [ $# -eq 0 ]; then
    echo "What would you like to do?"
    echo "1) Build and start development environment"
    echo "2) Build and start production services"
    echo "3) Build specific service"
    echo "4) Just build (no start)"
    echo ""
    read -p "Choice (1-4): " -n 1 -r
    echo ""
    
    case $REPLY in
        1)
            echo -e "${BLUE}🚀 Building and starting development environment...${NC}"
            docker-compose build dev
            docker-compose up -d postgres redis
            docker-compose up dev
            ;;
        2)
            echo -e "${BLUE}🚀 Building and starting production services...${NC}"
            docker-compose build
            docker-compose up -d
            ;;
        3)
            echo "Available services: api, web, dev, postgres, redis"
            read -p "Service name: " service
            echo -e "${BLUE}🚀 Building ${service}...${NC}"
            docker-compose build $service
            ;;
        4)
            echo -e "${BLUE}🏗️  Building all services...${NC}"
            docker-compose build
            ;;
        *)
            echo -e "${RED}❌ Invalid choice${NC}"
            exit 1
            ;;
    esac
else
    # Handle command line arguments
    case "$1" in
        "dev")
            echo -e "${BLUE}🚀 Building and starting development environment...${NC}"
            docker-compose build dev
            docker-compose up -d postgres redis
            docker-compose up dev
            ;;
        "prod"|"production")
            echo -e "${BLUE}🚀 Building and starting production services...${NC}"
            docker-compose build
            docker-compose up -d
            ;;
        "build")
            if [ -n "$2" ]; then
                echo -e "${BLUE}🏗️  Building ${2}...${NC}"
                docker-compose build $2
            else
                echo -e "${BLUE}🏗️  Building all services...${NC}"
                docker-compose build
            fi
            ;;
        "help"|"-h"|"--help")
            echo "Usage: $0 [command] [service]"
            echo ""
            echo "Commands:"
            echo "  dev          Build and start development environment"
            echo "  prod         Build and start production services"
            echo "  build [svc]  Build all services or specific service"
            echo "  help         Show this help"
            echo ""
            echo "Services: api, web, dev, postgres, redis"
            ;;
        *)
            echo -e "${RED}❌ Unknown command: $1${NC}"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
fi

echo ""
echo -e "${GREEN}🎉 Done!${NC}"

# Show helpful information
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo -e "${BLUE}📋 Running services:${NC}"
    docker-compose ps
    echo ""
    echo -e "${BLUE}🔗 Access your application:${NC}"
    echo "• Web: http://localhost:3000"
    echo "• API: http://localhost:3001"
    echo "• Vite Dev: http://localhost:5173"
    echo ""
    echo -e "${BLUE}💡 Useful commands:${NC}"
    echo "• View logs: docker-compose logs -f"
    echo "• Stop services: docker-compose down"
    echo "• Access dev container: docker-compose exec dev bash"
fi
