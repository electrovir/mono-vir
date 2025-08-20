import {join} from 'node:path';
import {KillOn, runCommands, type Command} from 'runstorm';
import {findLongestCommonPath} from '../../augments/path.js';
import {MonoCliInputError} from '../../cli/mono-cli-input.error.js';
import {type CommandInputs, type CommandOutput} from '../command.js';
import {getRelativePosixPackagePathsInDependencyOrder} from '../workspace-packages/get-package-dependency-order.js';

/**
 * Run the command for each package in sequential, dependency order.
 *
 * @category Internal
 */
export async function runForEachCommand({
    cwd,
    commandInputs,
}: Readonly<Omit<CommandInputs, 'maxConcurrency'>>): Promise<CommandOutput> {
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
        maxConcurrency: 1,
    });
}
