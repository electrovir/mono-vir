import {commands} from './mono-vir-commands';
import {MonoVirInputs} from './mono-vir-inputs';

export async function runMonoVir({command, commandInputs, cwd}: MonoVirInputs) {
    const commandToRun = await commands[command]();

    await commandToRun({cwd, commandInputs});
}
