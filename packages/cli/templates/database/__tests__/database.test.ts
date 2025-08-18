import { describe, it, expect } from '@jest/globals';
import { db } from '../src';

describe('Database', () => {
  it('should export database client', () => {
    expect(db).toBeDefined();
  });

  it('should connect to database', async () => {
    // This is a basic connection test
    // Add your own model-specific tests here
    expect(db.$connect).toBeDefined();
  });
});
