import {type TypedFunction} from '@augment-vir/common';
import {type runCommands} from 'runstorm';

/**
 * The inputs for internal mono-vir commands.
 *
 * @category Internal
 */
export type CommandInputs = {
    cwd: string;
    commandInputs: string[];
    maxConcurrency: number | undefined;
};

/**
 * Type for internal command implementations.
 *
 * @category Internal
 */
export type CommandFunction = TypedFunction<
    Readonly<CommandInputs>,
    Promise<ReturnType<typeof runCommands>>
>;
