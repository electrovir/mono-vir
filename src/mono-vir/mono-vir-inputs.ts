import {type MonoVirCommandEnum} from './mono-vir-commands.js';

/** Inputs for mono-vir itself. */
export type MonoVirInputs = {
    cwd: string;
    command: MonoVirCommandEnum;
    commandInputs: ReadonlyArray<string>;
};
