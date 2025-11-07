-- PostgreSQL initialization script for Idealyst
-- This script sets up the database with proper extensions and initial configurations

\echo 'Creating database extensions...'

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable ltree for hierarchical data
CREATE EXTENSION IF NOT EXISTS "ltree";

-- Enable pg_trgm for text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enable unaccent for text normalization
CREATE EXTENSION IF NOT EXISTS "unaccent";

\echo 'Database extensions created successfully!'

-- Create development and test databases if they don't exist
SELECT 'CREATE DATABASE idealyst_dev'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'idealyst_dev')\gexec

SELECT 'CREATE DATABASE idealyst_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'idealyst_test')\gexec

\echo 'Development and test databases created!'

-- Set up basic configuration
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 1000;
ALTER SYSTEM SET max_connections = 200;

-- Reload configuration
SELECT pg_reload_conf();

\echo 'PostgreSQL initialization complete!'
