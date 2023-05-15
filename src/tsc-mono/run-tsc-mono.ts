import {awaitedForEach} from '@augment-vir/common';
import {log, runShellCommand} from '@augment-vir/node-js';
import {join} from 'path';
import {UserCommandFailedError} from '../cli/user-command-failed.error';
import {tscMonoPackageName} from '../package-names';
import {getProjectDependencyOrder} from './dependency-ordering/get-project-dependency-order';
import {TscMonoCommandEnum} from './tsc-mono-commands';
import {TscMonoInputs} from './tsc-mono-inputs';

export async function runTscMono({command, commandInputs, cwd}: TscMonoInputs) {
    if (command === TscMonoCommandEnum.ForEach) {
        const dependencyOrdering = await getProjectDependencyOrder(cwd);

        if (!dependencyOrdering.length) {
            throw new Error(
                `${tscMonoPackageName} found no packages. Be sure that you are using the "workspaces" package.json field.`,
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
                throw new UserCommandFailedError();
            }
        });
    } else {
        throw new Error(`Command '${command}' is not yet implemented in '${tscMonoPackageName}'.`);
    }
}
