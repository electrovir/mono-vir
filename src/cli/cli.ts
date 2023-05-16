#!/usr/bin/env node

import {extractErrorMessage} from '@augment-vir/common';
import {log} from '@augment-vir/node-js';
import {printHelpMessage} from '../help-message';
import {runMonoVir} from '../mono-vir/run-mono-vir';
import {MonoCliInputError} from './mono-command-failed.error';
import {noHelpFlag, parseArgs} from './parse-cli-args';

async function cliMain() {
    const inputs = parseArgs(process.argv, __filename);
    await runMonoVir(inputs);
}

cliMain().catch((error) => {
    log.error(extractErrorMessage(error));
    if (!process.argv.includes(noHelpFlag) && error instanceof MonoCliInputError) {
        printHelpMessage();
    }
    process.exit(1);
});
