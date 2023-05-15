import {MonoCommandFailedError} from '../cli/mono-command-failed.error';
import {CommandFunction} from './command';

export enum MonoVirCommandEnum {
    ForEach = 'for-each',
}

function commandNotImplementedYet() {
    throw new MonoCommandFailedError('Command not implemented yet.');
}

export const commands: Record<MonoVirCommandEnum, () => Promise<CommandFunction>> = {
    [MonoVirCommandEnum.ForEach]: async () => {
        const importedFile = await import('./command-implementations/for-each.command');
        return importedFile.runForEachCommand;
    },
};
