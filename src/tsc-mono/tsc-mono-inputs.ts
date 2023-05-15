import {TscMonoCommandEnum} from './tsc-mono-commands';

export type TscMonoInputs = {
    cwd: string;
    command: TscMonoCommandEnum;
    commandInputs: ReadonlyArray<string>;
};
