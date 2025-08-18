import {extractErrorMessage, log} from '@augment-vir/common';
import {parseArgs} from 'cli-vir';
import {monoVirArgDefinitions, type MonoVirArgs} from '../mono-vir/mono-vir-inputs.js';
import {runMonoVir} from '../mono-vir/run-mono-vir.js';
import {MonoCliInputError} from './mono-cli-input.error.js';

export async function runMonoVirCli(
    rawArgs: ReadonlyArray<string>,
    importMeta: ImportMeta,
    cwd: string = process.cwd(),
) {
    try {
        const args: MonoVirArgs = parseArgs(rawArgs, monoVirArgDefinitions, {
            binName: 'mono-vir',
            importMeta,
        });

        const {highestExitCode} = await runMonoVir({
            ...args,
            cwd,
        });
        process.exit(highestExitCode);
    } catch (error) {
        if (error instanceof MonoCliInputError) {
            log.error(extractErrorMessage(error));
        } else {
            log.error(error);
        }

        process.exit(1);
    }
}
