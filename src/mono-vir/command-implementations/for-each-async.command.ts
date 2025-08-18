import {join} from 'node:path';
import {KillOn, runCommands, type Command} from 'runstorm';
import {findLongestCommonPath} from '../../augments/path.js';
import {MonoCliInputError} from '../../cli/mono-cli-input.error.js';
import {type CommandInputs} from '../command.js';
import {getRelativePosixPackagePathsInDependencyOrder} from '../workspace-packages/get-package-dependency-order.js';
import {runForEachCommand} from './for-each.command.js';

/**
 * Run the command for each package in parallel.
 *
 * @category Internal
 */
export async function runForEachAsyncCommand({
    cwd,
    commandInputs,
    maxConcurrency,
}: Readonly<CommandInputs>): Promise<ReturnType<typeof runCommands>> {
    if (maxConcurrency === 1) {
        return await runForEachCommand({cwd, commandInputs});
    }
    const relativePackagePathsInOrder = await getRelativePosixPackagePathsInDependencyOrder(cwd);

    const shellCommand = commandInputs.join(' ');

    if (!shellCommand) {
        throw new MonoCliInputError(`No inputs were given to the for-each-async command.`);
    }

    const commonPath = findLongestCommonPath(relativePackagePathsInOrder);

    const commands: Exclude<Omit<Command, 'color'>, string>[] = relativePackagePathsInOrder.map(
        (relativePackagePath) => {
            return {
                command: shellCommand,
                cwd: join(cwd, relativePackagePath),
                name: relativePackagePath.replace(commonPath, '').replace(/^\//, ''),
            };
        },
    );

    return await runCommands(commands, {
        killOn: KillOn.Failure,
        maxConcurrency,
    });
}
