import {awaitedForEach, log} from '@augment-vir/common';
import {runShellCommand} from '@augment-vir/node';
import {join} from 'node:path';
import {type ReadonlyDeep} from 'type-fest';
import {MonoCliInputError} from '../../cli/mono-cli-input.error.js';
import {type CommandInputs} from '../command.js';
import {getRelativePosixPackagePathsInDependencyOrder} from '../workspace-packages/get-package-dependency-order.js';

export async function runForEachCommand({cwd, commandInputs}: ReadonlyDeep<CommandInputs>) {
    const relativePackagePathsInOrder = await getRelativePosixPackagePathsInDependencyOrder(cwd);

    const shellCommand = commandInputs.join(' ');

    if (!shellCommand) {
        throw new MonoCliInputError(`No inputs were given to the for-each command.`);
    }

    await awaitedForEach(relativePackagePathsInOrder, async (relativePackagePath) => {
        log.faint(`${relativePackagePath} > ${shellCommand}`);
        await runShellCommand(shellCommand, {
            rejectOnError: true,
            cwd: join(cwd, relativePackagePath),
            hookUpToConsole: true,
        });
    });
}
