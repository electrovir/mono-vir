import {isEnumValue} from '@augment-vir/common';
import {resolve} from 'path';
import {MonoVirCommandEnum} from '../mono-vir/mono-vir-commands';
import {MonoVirInputs} from '../mono-vir/mono-vir-inputs';
import {monoVirBinName} from '../package-names';
import {MonoCliInputError} from './mono-cli-input.error';

export const noHelpFlag = '--no-help';

export function parseArgs(args: ReadonlyArray<string>, cliFileName: string): MonoVirInputs {
    const commandStartIndex = args.findIndex((arg) => {
        return (
            arg.endsWith(`/${monoVirBinName}`) ||
            arg === monoVirBinName ||
            resolve(arg) === cliFileName
        );
    });

    if (commandStartIndex === -1) {
        throw new MonoCliInputError(
            `Failed to find '${monoVirBinName}' in '${args.join(
                ' ',
            )}'. Make sure you're using the '${monoVirBinName}' command.`,
        );
    }

    const commandInputs: ReadonlyArray<string> = args
        .slice(commandStartIndex + 1)
        .filter((arg) => arg !== noHelpFlag);

    const commandInput = commandInputs[0];

    if (!isEnumValue(commandInput, MonoVirCommandEnum)) {
        throw new MonoCliInputError(`Unknown '${monoVirBinName}' command given: '${commandInput}'`);
    }

    const currentCliCommand: MonoVirCommandEnum = commandInput;
    const cliCommandInputs: ReadonlyArray<string> = commandInputs.slice(1);

    return {
        command: currentCliCommand,
        commandInputs: cliCommandInputs,
        cwd: process.cwd(),
    };
}
