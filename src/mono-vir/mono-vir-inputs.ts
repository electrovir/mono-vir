import {ArgValueType, FlagRequirement, type ArgDefinitions, type ParsedArgs} from 'cli-vir';
import {MonoVirCommand} from './mono-vir-commands.js';

/**
 * Arg definitions for mock-vir.
 *
 * @category Internal
 */
export const monoVirArgDefinitions = {
    command: {
        type: MonoVirCommand,
        description: `Available mono-vir commands.\n${MonoVirCommand.ForEach}: run for each package sequentially in package dependency order.\n${MonoVirCommand.ForEachAsync}: run for each package all in parallel.`,
        position: {
            index: 0,
            disableFlags: true,
        },
        required: true,
    },
    maxConcurrency: {
        description: `Only relevant for ${MonoVirCommand.ForEachAsync}: The max number of commands to run in parallel. The default is the number of CPU cores available - 1.`,
        flag: {
            valueRequirement: FlagRequirement.Required,
        },
        type: ArgValueType.Number,
    },
    commandInputs: {
        position: {
            rest: true,
            disableFlags: true,
        },
    },
} as const satisfies ArgDefinitions;

/**
 * Arg definitions for mock-vir.
 *
 * @category Internal
 */
export type MonoVirArgs = ParsedArgs<typeof monoVirArgDefinitions>;
