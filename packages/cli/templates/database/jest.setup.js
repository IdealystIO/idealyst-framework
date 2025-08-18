// Global test setup
import { beforeEach, afterEach } from '@jest/globals';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';

// Clean up after each test
afterEach(async () => {
  // Add any cleanup logic here
});
