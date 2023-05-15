import {TypedFunction} from '@augment-vir/common';
import {ReadonlyDeep} from 'type-fest';

export type CommandInputs = {
    cwd: string;
    commandInputs: string[];
};

export type CommandFunction = TypedFunction<ReadonlyDeep<CommandInputs>, Promise<void>>;
