import {MonoVirCommandEnum} from './mono-vir-commands';

export type MonoVirInputs = {
    cwd: string;
    command: MonoVirCommandEnum;
    commandInputs: ReadonlyArray<string>;
};
