#!/usr/bin/env node

/**
 * Simple test client to verify the MCP server is working
 */

import { spawn } from 'child_process';

// Start the MCP server
const server = spawn('node', ['./dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let responseData = '';

server.stdout.on('data', (data) => {
  responseData += data.toString();

  // Try to parse JSON responses
  const lines = responseData.split('\n');
  lines.forEach(line => {
    if (line.trim() && line.includes('{')) {
      try {
        const json = JSON.parse(line);
        console.log('Response:', JSON.stringify(json, null, 2));
      } catch (e) {
        // Not JSON, probably stderr message
      }
    }
  });
});

server.stderr.on('data', (data) => {
  console.error('Server:', data.toString().trim());
});

// Wait a moment for server to start
setTimeout(() => {
  console.log('\n📋 Testing list_tools...\n');

  // Send a request to list tools
  const request = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {}
  };

  server.stdin.write(JSON.stringify(request) + '\n');

  // Wait for response
  setTimeout(() => {
    console.log('\n🔍 Testing get_component_docs for Button...\n');

    const toolRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'get_component_docs',
        arguments: {
          component: 'Button'
        }
      }
    };

    server.stdin.write(JSON.stringify(toolRequest) + '\n');

    // Close after a moment
    setTimeout(() => {
      console.log('\n✅ Test complete!\n');
      server.kill();
      process.exit(0);
    }, 2000);
  }, 2000);
}, 1000);

// Handle errors
server.on('error', (error) => {
  console.error('Error:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});
