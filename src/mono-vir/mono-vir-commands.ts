import {MonoCliInputError} from '../cli/mono-command-failed.error';
import {CommandFunction} from './command';

export enum MonoVirCommandEnum {
    ForEach = 'for-each',
    ForEachAsync = 'for-each-async',
}

function commandNotImplementedYet() {
    throw new MonoCliInputError('Command not implemented yet.');
}

export const commands: Record<MonoVirCommandEnum, () => Promise<CommandFunction>> = {
    [MonoVirCommandEnum.ForEach]: async () => {
        const importedFile = await import('./command-implementations/for-each.command');
        return importedFile.runForEachCommand;
    },
    [MonoVirCommandEnum.ForEachAsync]: async () => {
        const importedFile = await import('./command-implementations/for-each-async.command');
        return importedFile.runForEachAsyncCommand;
    },
};
