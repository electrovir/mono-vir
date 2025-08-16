import {type ArgDefinitions, type ParsedArgs} from 'cli-vir';
import {MonoVirCommandEnum} from './mono-vir-commands.js';

/**
 * Arg definitions for mock-vir.
 *
 * @category Internal
 */
export const monoVirArgDefinitions = {
    command: {
        type: MonoVirCommandEnum,
        description: `Available mono-vir commands.\n${MonoVirCommandEnum.ForEach}: run for each package sequentially in package dependency order.\n${MonoVirCommandEnum.ForEachAsync}: run for each package all in parallel.`,
        position: {
            index: 0,
            disableFlags: true,
        },
        required: true,
    },
    commandInputs: {
        position: {
            rest: true,
        },
    },
} as const satisfies ArgDefinitions;

/**
 * Arg definitions for mock-vir.
 *
 * @category Internal
 */
export type MonoVirArgs = ParsedArgs<typeof monoVirArgDefinitions>;
