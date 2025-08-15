import fs from 'fs-extra';
import path from 'path';
import os from 'os';

// Helper to create temporary test directory
export const createTempDir = async (testName: string): Promise<string> => {
  const tempDir = path.join(os.tmpdir(), 'idealyst-cli-tests', testName, Date.now().toString());
  await fs.ensureDir(tempDir);
  return tempDir;
};

// Helper to clean up test directory
export const cleanupTempDir = async (tempDir: string): Promise<void> => {
  if (await fs.pathExists(tempDir)) {
    await fs.remove(tempDir);
  }
};

// Helper to mock inquirer responses
export const mockInquirerResponses = (responses: Record<string, any>) => {
  const inquirer = require('inquirer');
  jest.spyOn(inquirer, 'prompt').mockImplementation((...args: any[]) => {
    const questions = args[0] as any[];
    const answers: Record<string, any> = {};
    questions.forEach((question) => {
      if (responses[question.name]) {
        answers[question.name] = responses[question.name];
      }
    });
    return Promise.resolve(answers);
  });
};

// Helper to verify file exists and has content
export const verifyFileExists = async (filePath: string, shouldContain?: string[]): Promise<void> => {
  expect(await fs.pathExists(filePath)).toBe(true);
  
  if (shouldContain) {
    const content = await fs.readFile(filePath, 'utf8');
    shouldContain.forEach(text => {
      expect(content).toContain(text);
    });
  }
};

// Helper to verify directory structure
export const verifyDirectoryStructure = async (baseDir: string, expectedPaths: string[]): Promise<void> => {
  for (const expectedPath of expectedPaths) {
    const fullPath = path.join(baseDir, expectedPath);
    expect(await fs.pathExists(fullPath)).toBe(true);
  }
};
