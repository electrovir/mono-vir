import {commands} from './mono-vir-commands';
import {MonoVirInputs} from './mono-vir-inputs';

/** Entry point for mono-vir. */
export async function runMonoVir({command, commandInputs, cwd}: MonoVirInputs) {
    const commandToRun = await commands[command]();

    await commandToRun({cwd, commandInputs});
}
