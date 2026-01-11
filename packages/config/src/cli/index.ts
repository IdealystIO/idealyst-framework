#!/usr/bin/env node

import path from 'path'
import { generateConfigTypes, findEnvFile } from './generate'

function printUsage(): void {
  console.log(`
@idealyst/config - Generate TypeScript types from .env files

Usage:
  idealyst-config generate [options]

Options:
  --env <path>      Path to .env file (default: auto-detect)
  --output <path>   Output path for .d.ts file (default: src/env.d.ts)
  --help            Show this help message

Examples:
  idealyst-config generate
  idealyst-config generate --env .env.local
  idealyst-config generate --env .env --output types/env.d.ts
`)
}

function parseArgs(args: string[]): { command?: string; env?: string; output?: string; help?: boolean } {
  const result: { command?: string; env?: string; output?: string; help?: boolean } = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === '--help' || arg === '-h') {
      result.help = true
    } else if (arg === '--env' && args[i + 1]) {
      result.env = args[++i]
    } else if (arg === '--output' && args[i + 1]) {
      result.output = args[++i]
    } else if (!arg.startsWith('-') && !result.command) {
      result.command = arg
    }
  }

  return result
}

function main(): void {
  const args = parseArgs(process.argv.slice(2))

  if (args.help || (!args.command && process.argv.length <= 2)) {
    printUsage()
    process.exit(0)
  }

  if (args.command !== 'generate') {
    console.error(`Unknown command: ${args.command}`)
    console.error('Run "idealyst-config --help" for usage information.')
    process.exit(1)
  }

  const cwd = process.cwd()

  // Find or use the specified .env file
  let envPath: string
  if (args.env) {
    envPath = path.isAbsolute(args.env) ? args.env : path.join(cwd, args.env)
  } else {
    const foundEnv = findEnvFile(cwd)
    if (!foundEnv) {
      console.error('Error: No .env file found in current directory.')
      console.error('Create a .env file or specify one with --env <path>')
      process.exit(1)
    }
    envPath = foundEnv
  }

  // Determine output path
  const outputPath = args.output
    ? (path.isAbsolute(args.output) ? args.output : path.join(cwd, args.output))
    : path.join(cwd, 'src', 'env.d.ts')

  try {
    const result = generateConfigTypes({
      envPath,
      outputPath,
    })

    console.log(`Generated config types at: ${result}`)
    console.log(`Source: ${envPath}`)
  } catch (error) {
    console.error('Error generating config types:', (error as Error).message)
    process.exit(1)
  }
}

main()
