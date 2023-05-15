import {awaitedForEach} from '@augment-vir/common';
import {log, runShellCommand} from '@augment-vir/node-js';
import {join} from 'path';
import {ReadonlyDeep} from 'type-fest';
import {MonoCommandFailedError} from '../../cli/mono-command-failed.error';
import {monoVirPackageName} from '../../package-names';
import {CommandInputs} from '../command';
import {getPackageDependencyOrder} from '../workspace-packages/get-package-dependency-order';

export async function runForEachCommand({cwd, commandInputs}: ReadonlyDeep<CommandInputs>) {
    const dependencyOrdering = await getPackageDependencyOrder(cwd);

    if (!dependencyOrdering.length) {
        throw new Error(
            `${monoVirPackageName} found no packages. Be sure that you are using the "workspaces" package.json field.`,
        );
    }

    const shellCommand = commandInputs.join(' ');

    if (!shellCommand) {
        throw new Error(`No inputs were given to the for-each command.`);
    }

    await awaitedForEach(dependencyOrdering, async (projectDirPath) => {
        log.faint(`${projectDirPath} > ${shellCommand}`);
        try {
            await runShellCommand(shellCommand, {
                rejectOnError: true,
                cwd: join(cwd, projectDirPath),
                hookUpToConsole: true,
            });
        } catch (error) {
            throw new MonoCommandFailedError();
        }
    });
}
