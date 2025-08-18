import {type runCommands} from 'runstorm';
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
}: Readonly<MonoVirParams>): Promise<ReturnType<typeof runCommands>> {
    const commandToRun = await commands[command]();

    return await commandToRun({
        cwd,
        commandInputs,
        maxConcurrency: maxConcurrency || undefined,
    });
}
