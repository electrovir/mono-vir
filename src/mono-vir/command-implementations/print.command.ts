import {type CommandInputs, type CommandOutput} from '../command.js';
import {writePackageDepsToFile} from '../workspace-packages/package-tree.js';

/**
 * Print the package dependency graph.
 *
 * @category Internal
 */
export async function runPrintCommand({
    cwd,
    exclude,
}: Readonly<CommandInputs>): Promise<CommandOutput> {
    await writePackageDepsToFile({
        cwd,
        exclude,
    });

    return {
        exitCodes: [0],
        highestExitCode: 0,
    };
}
