import {CommandFunction} from './command';

/** All available commands for mono-vir. */
export enum MonoVirCommandEnum {
    ForEach = 'for-each',
    ForEachAsync = 'for-each-async',
}

// function commandNotImplementedYet() {
//     throw new MonoCliInputError('Command not implemented yet.');
// }

/** Imports the command function so that only the needed files are imported at run-time. */
type CommandImporter = () => Promise<CommandFunction>;

/** The list of currently implemented mono-vir commands. */
export const commands: Record<MonoVirCommandEnum, CommandImporter> = {
    /**
     * For each command: executes upon every npm workspace in sequential order based on their
     * dependency tree.
     */
    [MonoVirCommandEnum.ForEach]: async () => {
        const importedFile = await import('./command-implementations/for-each.command');
        return importedFile.runForEachCommand;
    },
    /** For each async command: executes upon every npm workspace in parallel all at once. */
    [MonoVirCommandEnum.ForEachAsync]: async () => {
        const importedFile = await import('./command-implementations/for-each-async.command');
        return importedFile.runForEachAsyncCommand;
    },
};
