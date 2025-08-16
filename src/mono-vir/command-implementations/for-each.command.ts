import {join} from 'node:path';
import {type ReadonlyDeep} from 'type-fest';
import {MonoCliInputError} from '../../cli/mono-cli-input.error.js';
import {type CommandInputs} from '../command.js';
import {getRelativePosixPackagePathsInDependencyOrder} from '../workspace-packages/get-package-dependency-order.js';

import {KillOn, runCommands, type Command} from 'runstorm';
import {findLongestCommonPath} from '../../augments/path.js';

export async function runForEachCommand({cwd, commandInputs}: ReadonlyDeep<CommandInputs>) {
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

    const {highestExitCode} = await runCommands(commands, {
        killOn: KillOn.Failure,
        maxConcurrency: 1,
    });

    process.exit(highestExitCode);
}
