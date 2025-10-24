#! /usr/bin/env node

import fs from 'node:fs/promises';
import { createParser } from './parsers/parserfactory';
import { assemble } from './assembler';
import { Config } from './types';

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
  const config = <Config>JSON.parse(await fs.readFile(configPath, 'utf-8'));
  const input = await fs.readFile(inputPath, 'utf-8');

  const parser = createParser(config.parser);
  const parsedRecords = await parser(input);

  const records = assemble(config.assembler, parsedRecords);

  console.log(JSON.stringify(records, null, 2));
}

run().catch(console.error);
