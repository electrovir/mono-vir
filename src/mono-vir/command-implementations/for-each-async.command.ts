import concurrently, {ConcurrentlyCommandInput} from 'concurrently';
import {join} from 'path';
import {ReadonlyDeep} from 'type-fest';
import {CloseEvent} from '../../../node_modules/concurrently/dist/src/command';
import {findLongestCommentPath} from '../../augments/path';
import {MonoCliInputError} from '../../cli/mono-command-failed.error';
import {CommandInputs} from '../command';
import {getRelativePosixPackagePathsInDependencyOrder} from '../workspace-packages/get-package-dependency-order';

export async function runForEachAsyncCommand({cwd, commandInputs}: ReadonlyDeep<CommandInputs>) {
    const relativePackagePathsInOrder = await getRelativePosixPackagePathsInDependencyOrder(cwd);

    const shellCommand = commandInputs.join(' ');

    if (!shellCommand) {
        throw new MonoCliInputError(`No inputs were given to the for-each-async command.`);
    }

    const commonPath = findLongestCommentPath(relativePackagePathsInOrder);

    const commands: Exclude<ConcurrentlyCommandInput, string>[] = relativePackagePathsInOrder.map(
        (relativePackagePath) => {
            return {
                command: shellCommand,
                cwd: join(cwd, relativePackagePath),
                name: relativePackagePath.replace(commonPath, '').replace(/^\//, ''),
            };
        },
    );

    let concurrentlyResults: ReadonlyArray<CloseEvent> = [];
    let failed = false;

    process.env.FORCE_COLOR = '1';
    try {
        concurrentlyResults = await concurrently(commands, {
            prefixColors: ['auto'],
            killOthers: 'failure',
            killSignal: 'SIGKILL',
        }).result;
    } catch (error) {
        failed = true;
        if (Array.isArray(error)) {
            concurrentlyResults = error;
        } else {
            throw error;
        }
    }

    if (!failed) {
        return;
    }

    const failedCommands = concurrentlyResults.filter((result) => {
        return result.exitCode !== 0 && !result.killed;
    });

    const failedCommandNames = failedCommands.map((failedCommand) => {
        return failedCommand.command.name;
    });

    const startString = `'${shellCommand}' failed for`;

    const allFailureStrings = [
        startString,
        ...failedCommandNames,
    ];

    const joinString = failedCommandNames.length > 1 ? '\n    ' : ' ';

    const errorMessage = allFailureStrings.join(joinString);

    throw new Error(errorMessage);
}
