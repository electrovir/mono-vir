import {isEnumValue} from '@augment-vir/common';
import {resolve} from 'path';
import {tscMonoBinName} from '../package-names';
import {TscMonoCommandEnum} from '../tsc-mono/tsc-mono-commands';
import {TscMonoInputs} from '../tsc-mono/tsc-mono-inputs';

export const noHelpFlag = '--no-help';

export function parseArgs(args: ReadonlyArray<string>, cliFileName: string): TscMonoInputs {
    const commandStartIndex = args.findIndex((arg) => {
        return (
            arg.endsWith(`/${tscMonoBinName}`) ||
            arg === tscMonoBinName ||
            resolve(arg) === cliFileName
        );
    });

    if (commandStartIndex === -1) {
        throw new Error(
            `Failed to find '${tscMonoBinName}' in '${args.join(
                ' ',
            )}'. Make sure you're using the '${tscMonoBinName}' command.`,
        );
    }

    const commandInputs: ReadonlyArray<string> = args
        .slice(commandStartIndex + 1)
        .filter((arg) => arg !== noHelpFlag);

    const commandInput = commandInputs[0];

    if (!isEnumValue(commandInput, TscMonoCommandEnum)) {
        throw new Error(`Unknown '${tscMonoBinName}' command given: '${commandInput}'`);
    }

    const currentCliCommand: TscMonoCommandEnum = commandInput;
    const cliCommandInputs: ReadonlyArray<string> = commandInputs.slice(1);

    return {
        command: currentCliCommand,
        commandInputs: cliCommandInputs,
        cwd: process.cwd(),
    };
}
