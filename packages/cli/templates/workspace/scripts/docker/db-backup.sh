#!/bin/bash

# Database backup and restore script for Idealyst workspace
# Usage: ./scripts/docker/db-backup.sh [backup|restore] [filename]

set -e

COMMAND=${1:-backup}
FILENAME=${2:-"backup-$(date +%Y%m%d-%H%M%S).sql"}
PROJECT_NAME=${PROJECT_NAME:-idealyst}

# Source environment variables
if [ -f ".env" ]; then
    source .env
fi

POSTGRES_CONTAINER="${PROJECT_NAME}-postgres"
DATABASE=${POSTGRES_DB:-idealyst_db}
USERNAME=${POSTGRES_USER:-postgres}

echo "🗄️ Database Operations for Idealyst"
echo "===================================="

# Function to check if database container is running
check_database() {
    if ! docker ps | grep -q "$POSTGRES_CONTAINER"; then
        echo "❌ Database container '$POSTGRES_CONTAINER' is not running"
        echo "💡 Start it with: docker-compose up -d postgres"
        exit 1
    fi
}

# Function to create backup
create_backup() {
    local backup_file=$1
    
    echo "📦 Creating backup of database '$DATABASE'..."
    echo "📁 Backup file: $backup_file"
    
    # Create backups directory if it doesn't exist
    mkdir -p backups
    
    # Create the backup
    docker exec "$POSTGRES_CONTAINER" pg_dump \
        -U "$USERNAME" \
        -d "$DATABASE" \
        --clean \
        --if-exists \
        --create \
        --verbose > "backups/$backup_file"
    
    if [ $? -eq 0 ]; then
        echo "✅ Backup created successfully: backups/$backup_file"
        
        # Show backup info
        local size=$(du -h "backups/$backup_file" | cut -f1)
        echo "📊 Backup size: $size"
        
        # Compress the backup
        gzip "backups/$backup_file"
        echo "🗜️ Backup compressed: backups/$backup_file.gz"
        
    else
        echo "❌ Backup failed"
        exit 1
    fi
}

# Function to restore backup
restore_backup() {
    local backup_file=$1
    
    # Check if backup file exists
    if [ ! -f "$backup_file" ]; then
        # Try with .gz extension
        if [ -f "$backup_file.gz" ]; then
            echo "📦 Found compressed backup, extracting..."
            gunzip "$backup_file.gz"
        else
            echo "❌ Backup file not found: $backup_file"
            echo "📁 Available backups:"
            ls -la backups/ 2>/dev/null || echo "No backups directory found"
            exit 1
        fi
    fi
    
    echo "⚠️  WARNING: This will replace the current database '$DATABASE'"
    echo "📁 Restoring from: $backup_file"
    
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Restore cancelled"
        exit 1
    fi
    
    echo "🔄 Restoring database..."
    
    # Stop API container to prevent connections
    echo "🛑 Stopping API container..."
    docker-compose stop api 2>/dev/null || true
    
    # Wait a moment for connections to close
    sleep 2
    
    # Restore the backup
    docker exec -i "$POSTGRES_CONTAINER" psql \
        -U "$USERNAME" \
        -d postgres < "$backup_file"
    
    if [ $? -eq 0 ]; then
        echo "✅ Database restored successfully"
        
        # Restart API container
        echo "🚀 Restarting API container..."
        docker-compose start api
        
    else
        echo "❌ Restore failed"
        echo "🚀 Restarting API container..."
        docker-compose start api
        exit 1
    fi
}

# Function to list backups
list_backups() {
    echo "📁 Available backups:"
    echo "===================="
    
    if [ -d "backups" ]; then
        ls -lah backups/ | grep -E '\.(sql|gz)$' || echo "No backup files found"
    else
        echo "No backups directory found"
    fi
}

# Function to clean old backups
clean_backups() {
    local days=${1:-7}
    
    echo "🧹 Cleaning backups older than $days days..."
    
    if [ -d "backups" ]; then
        find backups/ -name "*.sql.gz" -mtime +$days -delete
        find backups/ -name "*.sql" -mtime +$days -delete
        echo "✅ Old backups cleaned"
    else
        echo "No backups directory found"
    fi
}

# Function to show database info
show_db_info() {
    echo "📊 Database Information:"
    echo "======================="
    echo "Container: $POSTGRES_CONTAINER"
    echo "Database: $DATABASE"
    echo "Username: $USERNAME"
    echo ""
    
    # Show database size
    echo "🗄️ Database size:"
    docker exec "$POSTGRES_CONTAINER" psql \
        -U "$USERNAME" \
        -d "$DATABASE" \
        -c "SELECT pg_size_pretty(pg_database_size('$DATABASE')) as database_size;"
    
    echo ""
    echo "📋 Tables:"
    docker exec "$POSTGRES_CONTAINER" psql \
        -U "$USERNAME" \
        -d "$DATABASE" \
        -c "\dt"
}

# Main script logic
main() {
    case $COMMAND in
        "backup")
            check_database
            create_backup "$FILENAME"
            ;;
            
        "restore")
            check_database
            if [ -z "$FILENAME" ]; then
                echo "❌ Please specify a backup file to restore"
                echo "Usage: $0 restore <backup-file>"
                exit 1
            fi
            restore_backup "$FILENAME"
            ;;
            
        "list")
            list_backups
            ;;
            
        "clean")
            local days=${FILENAME:-7}
            clean_backups "$days"
            ;;
            
        "info")
            check_database
            show_db_info
            ;;
            
        *)
            echo "Usage: $0 [backup|restore|list|clean|info] [filename|days]"
            echo ""
            echo "Commands:"
            echo "  backup [filename]    - Create a database backup"
            echo "  restore <filename>   - Restore from a backup file"
            echo "  list                 - List available backups"
            echo "  clean [days]         - Clean backups older than N days (default: 7)"
            echo "  info                 - Show database information"
            echo ""
            echo "Examples:"
            echo "  $0 backup"
            echo "  $0 backup my-backup.sql"
            echo "  $0 restore backups/backup-20240101-120000.sql"
            echo "  $0 clean 30"
            exit 1
            ;;
    esac
}

main
