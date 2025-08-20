import {type CommandOutput} from './command.js';
import {commands} from './mono-vir-commands.js';
import {type MonoVirArgs} from './mono-vir-inputs.js';

/**
 * Params for {@link runMonoVir}.
 *
 * @category Internal
 */
export type MonoVirParams = MonoVirArgs & {
    cwd: string;
};

/**
 * API for running mono-vir.
 *
 * @category Main
 */
export async function runMonoVir({
    command,
    commandInputs,
    cwd,
    maxConcurrency,
}: Readonly<MonoVirParams>): Promise<CommandOutput> {
    const commandToRun = await commands[command]();

    return await commandToRun({
        cwd,
        commandInputs,
        maxConcurrency: maxConcurrency || undefined,
    });
}
