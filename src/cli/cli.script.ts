#!/usr/bin/env node

import {extractErrorMessage, log} from '@augment-vir/common';
import {printHelpMessage} from '../help-message.js';
import {runMonoVir} from '../mono-vir/run-mono-vir.js';
import {MonoCliInputError} from './mono-cli-input.error.js';
import {noHelpFlag, parseArgs} from './parse-cli-args.js';

async function cliMain() {
    const inputs = parseArgs(process.argv, import.meta.filename);
    await runMonoVir(inputs);
}

await cliMain().catch((error: unknown) => {
    log.error(extractErrorMessage(error));
    if (!process.argv.includes(noHelpFlag) && error instanceof MonoCliInputError) {
        printHelpMessage();
    }
    process.exit(1);
});
