/**
 * Logger utility for consistent CLI output
 */

import chalk from 'chalk';

export const logger = {
  /**
   * Log an info message
   */
  info(message: string): void {
    console.log(chalk.blue(message));
  },

  /**
   * Log a success message
   */
  success(message: string): void {
    console.log(chalk.green(message));
  },

  /**
   * Log a warning message
   */
  warn(message: string): void {
    console.log(chalk.yellow(`Warning: ${message}`));
  },

  /**
   * Log an error message
   */
  error(message: string): void {
    console.log(chalk.red(`Error: ${message}`));
  },

  /**
   * Log a step in the process
   */
  step(message: string): void {
    console.log(chalk.cyan(`\n→ ${message}`));
  },

  /**
   * Log a bullet point item
   */
  bullet(message: string, color: 'green' | 'yellow' | 'blue' | 'white' = 'white'): void {
    const colorFn = chalk[color];
    console.log(colorFn(`  • ${message}`));
  },

  /**
   * Log a code snippet or command
   */
  code(message: string): void {
    console.log(chalk.gray(`  $ ${message}`));
  },

  /**
   * Log a dimmed/subtle message
   */
  dim(message: string): void {
    console.log(chalk.dim(message));
  },

  /**
   * Log a bold message
   */
  bold(message: string): void {
    console.log(chalk.bold(message));
  },

  /**
   * Log a newline
   */
  newline(): void {
    console.log('');
  },

  /**
   * Log a horizontal separator
   */
  separator(): void {
    console.log(chalk.gray('─'.repeat(50)));
  },

  /**
   * Log a header with separator
   */
  header(message: string): void {
    console.log('');
    console.log(chalk.bold.blue(message));
    console.log(chalk.gray('─'.repeat(message.length)));
  },

  /**
   * Log a key-value pair
   */
  keyValue(key: string, value: string): void {
    console.log(`  ${chalk.gray(key + ':')} ${value}`);
  },
};

export default logger;
