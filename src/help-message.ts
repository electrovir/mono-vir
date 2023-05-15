import {monoVirBinName, monoVirPackageName} from './package-names';
const helpMessage = `
${monoVirPackageName} usage:

${monoVirBinName} <command> <command-inputs>

    - <command>: command that you want ${monoVirPackageName} to run. Example: "for-each"
    - <command-inputs>: inputs for the given command. The options here will vary by command. Example: "npm run build"

Commands:

for-each
    - runs the given <command-inputs> as a bash script for each of the repo's workspace packages
    - packages are executed in dependency order
    
    Examples:
        - ${monoVirBinName} for-each npm run build
        - ${monoVirBinName} for-each "npm run build && echo success"
`;

export function printHelpMessage() {
    console.info('\n');
    console.info(helpMessage);
}
