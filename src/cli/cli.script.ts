#!/usr/bin/env node

import {runMonoVirCli} from './cli.js';

await runMonoVirCli(process.argv, import.meta);
