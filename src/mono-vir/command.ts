import {type TypedFunction} from '@augment-vir/common';
import {type ReadonlyDeep} from 'type-fest';

/** The inputs for internal mono-vir commands. */
export type CommandInputs = {
    cwd: string;
    commandInputs: string[];
};

/** Type for internal command implementations. */
export type CommandFunction = TypedFunction<ReadonlyDeep<CommandInputs>, Promise<void>>;
