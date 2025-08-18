import {awaitedBlockingMap} from '@augment-vir/common';
import {join} from 'node:path';
import {KillOn, runCommands, type Command, type Exits} from 'runstorm';
import {findLongestCommonPath} from '../../augments/path.js';
import {MonoCliInputError} from '../../cli/mono-cli-input.error.js';
import {type CommandInputs} from '../command.js';
import {getRelativePosixPackagePathTreeInDependencyOrder} from '../workspace-packages/get-package-dependency-order.js';
import {runForEachCommand} from './for-each.command.js';

/**
 * Run the command for each package in dependency order, running any packages not dependent on each
 * other in parallel.
 *
 * @category Internal
 */
export async function runForEachTreeCommand({
    cwd,
    commandInputs,
    maxConcurrency,
}: Readonly<CommandInputs>): Promise<ReturnType<typeof runCommands>> {
    if (maxConcurrency === 1) {
        return await runForEachCommand({cwd, commandInputs});
    }
    const relativePackagePathsInOrder = await getRelativePosixPackagePathTreeInDependencyOrder(cwd);

    const shellCommand = commandInputs.join(' ');

    if (!shellCommand) {
        throw new MonoCliInputError(`No inputs were given to the for-each-tree command.`);
    }

    const commonPath = findLongestCommonPath(relativePackagePathsInOrder.flat());

    const commandLayers = relativePackagePathsInOrder.map((layer) => {
        return layer.map((relativePackagePath): Omit<Command, 'color'> => {
            return {
                command: shellCommand,
                cwd: join(cwd, relativePackagePath),
                name: relativePackagePath.replace(commonPath, '').replace(/^\//, ''),
            };
        });
    });

    const exitCodes: Exits = [];
    let highestExitCode = 0;

    await awaitedBlockingMap(commandLayers, async (commandLayer) => {
        const result = await runCommands(commandLayer, {
            killOn: KillOn.Failure,
            maxConcurrency,
        });
        exitCodes.push(...result.exitCodes);
        highestExitCode = Math.max(result.highestExitCode, highestExitCode);
    });

    return {
        exitCodes,
        highestExitCode,
    };
}
