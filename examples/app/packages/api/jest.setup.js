// Global test setup for API tests
// This file runs before all tests

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';

// Increase timeout for async operations
jest.setTimeout(10000);
