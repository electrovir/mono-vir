import {CommandFunction} from './command.js';

/** All available commands for mono-vir. */
export enum MonoVirCommandEnum {
    ForEach = 'for-each',
    ForEachAsync = 'for-each-async',
}

/** Imports the command function so that only the needed files are imported at run-time. */
type CommandImporter = () => Promise<CommandFunction>;

/** The list of currently implemented mono-vir commands. */
export const commands: Record<MonoVirCommandEnum, CommandImporter> = {
    /**
     * For each command: executes upon every npm workspace in sequential order based on their
     * dependency tree.
     */
    [MonoVirCommandEnum.ForEach]: async () => {
        const importedFile = await import('./command-implementations/for-each.command.js');
        return importedFile.runForEachCommand;
    },
    /** For each async command: executes upon every npm workspace in parallel all at once. */
    [MonoVirCommandEnum.ForEachAsync]: async () => {
        const importedFile = await import('./command-implementations/for-each-async.command.js');
        return importedFile.runForEachAsyncCommand;
    },
};
