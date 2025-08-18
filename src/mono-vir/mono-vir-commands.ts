import {type CommandFunction} from './command.js';

/** All available commands for mono-vir. */
export enum MonoVirCommand {
    ForEach = 'for-each',
    ForEachAsync = 'for-each-async',
    ForEachTree = 'for-each-tree',
}

/** Imports the command function so that only the needed files are imported at run-time. */
type CommandImporter = () => Promise<CommandFunction>;

/** The list of currently implemented mono-vir commands. */
export const commands: Record<MonoVirCommand, CommandImporter> = {
    /**
     * For each command: executes upon every npm workspace in sequential order based on their
     * dependency tree.
     */
    async [MonoVirCommand.ForEach]() {
        const importedFile = await import('./command-implementations/for-each.command.js');
        return importedFile.runForEachCommand;
    },
    /** For each async command: executes upon every npm workspace in parallel all at once. */
    async [MonoVirCommand.ForEachAsync]() {
        const importedFile = await import('./command-implementations/for-each-async.command.js');
        return importedFile.runForEachAsyncCommand;
    },
    /**
     * For each tree command: executes upon every npm workspace in dependency order, with
     * non-dependent workspaces running in parallel.
     */
    async [MonoVirCommand.ForEachTree]() {
        const importedFile = await import('./command-implementations/for-each-tree.command.js');
        return importedFile.runForEachTreeCommand;
    },
};
