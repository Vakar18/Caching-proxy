#!/usr/bin/env node

import { Command } from 'commander';
import { createApp } from './main';
import { CacheService } from './cache/cache.service';
import * as path from 'path';
import * as fs from 'fs';

const program = new Command();

program
  .name('caching-proxy')
  .description('A caching proxy server')
  .version('1.0.0');

program
  .option('-p, --port <number>', 'Port number for the proxy server')
  .option('-o, --origin <url>', 'Origin server URL')
  .option('--clear-cache', 'Clear the cache')
  .parse(process.argv);

const options = program.opts();

async function main() {
  if (options.clearCache) {
    // Clear cache
    const cacheService = new CacheService();
    cacheService.clear();
    console.log('✅ Cache cleared successfully!');
    process.exit(0);
  }

  if (!options.port || !options.origin) {
    console.error('❌ Error: Both --port and --origin are required to start the server');
    console.log('\nUsage:');
    console.log('  Start server: caching-proxy --port <number> --origin <url>');
    console.log('  Clear cache:  caching-proxy --clear-cache');
    console.log('\nExample:');
    console.log('  caching-proxy --port 3000 --origin http://dummyjson.com');
    process.exit(1);
  }

  const port = parseInt(options.port, 10);
  const origin = options.origin;

  if (isNaN(port) || port < 1 || port > 65535) {
    console.error('❌ Error: Invalid port number. Must be between 1 and 65535');
    process.exit(1);
  }

  try {
    await createApp(port, origin);
  } catch (error) {
    console.error('❌ Error starting server:', error.message);
    process.exit(1);
  }
}

main();