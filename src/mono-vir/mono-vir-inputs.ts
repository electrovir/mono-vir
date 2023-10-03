import {MonoVirCommandEnum} from './mono-vir-commands';

/** Inputs for mono-vir itself. */
export type MonoVirInputs = {
    cwd: string;
    command: MonoVirCommandEnum;
    commandInputs: ReadonlyArray<string>;
};
