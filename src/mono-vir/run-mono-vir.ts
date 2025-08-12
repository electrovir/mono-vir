import {commands} from './mono-vir-commands.js';
import {type MonoVirInputs} from './mono-vir-inputs.js';

/** Entry point for mono-vir. */
export async function runMonoVir({command, commandInputs, cwd}: MonoVirInputs) {
    const commandToRun = await commands[command]();

    await commandToRun({cwd, commandInputs});
}
