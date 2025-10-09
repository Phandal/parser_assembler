#! /usr/bin/env node

import fs from 'node:fs/promises';
import { createParser } from './parsers/parserfactory';

function usage() {
  console.error("Usage: npm start -- [config_path] [input_path]");
}

async function run() {
  if (process.argv.length < 4) {
    usage();
    process.exit(1);
  }

  const configPath = process.argv[2];
  const inputPath = process.argv[3];
  console.error('inputPath', inputPath);

  const config = JSON.parse(await fs.readFile(configPath, 'utf8'));

  const parser = createParser(config.parser);
  const records = await parser(inputPath);

  console.log(JSON.stringify(records, null, 2));
}

run().catch(console.error);
