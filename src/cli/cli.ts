#!/usr/bin/env node

import {extractErrorMessage} from '@augment-vir/common';
import {log} from '@augment-vir/node-js';
import {printHelpMessage} from '../help-message';
import {runTscMono} from '../tsc-mono/run-tsc-mono';
import {noHelpFlag, parseArgs} from './parse-cli-args';
import {UserCommandFailedError} from './user-command-failed.error';

async function cliMain() {
    const inputs = parseArgs(process.argv, __filename);
    await runTscMono(inputs);
}

cliMain().catch((error) => {
    if (!(error instanceof UserCommandFailedError)) {
        log.error(extractErrorMessage(error));
        if (!process.argv.includes(noHelpFlag)) {
            printHelpMessage();
        }
    }
    process.exit(1);
});
