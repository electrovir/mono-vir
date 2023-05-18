import {awaitedForEach} from '@augment-vir/common';
import {log, runShellCommand} from '@augment-vir/node-js';
import {join} from 'path';
import {ReadonlyDeep} from 'type-fest';
import {MonoCliInputError} from '../../cli/mono-command-failed.error';
import {CommandInputs} from '../command';
import {getRelativePosixPackagePathsInDependencyOrder} from '../workspace-packages/get-package-dependency-order';

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
