# tsc-mono

Super simple typescript mono-repo tooling.

It is recommended that you use at least TypeScript v5 as TypeScript v4 is significantly slower.

## Features

-   runs commands for each TS project in correct order based on the projects' dependency graph
-   relies on `package.json`'s `workspaces` property: no need to duplicate this information
-   [TSConfig reference paths](https://www.typescriptlang.org/docs/handbook/project-references.html) are not required
-   [TSConfig option `composite`](https://www.typescriptlang.org/tsconfig#composite) is not required
-   [TSConfig option `declarationMap`](https://www.typescriptlang.org/tsconfig#declarationMap) is not required
-   no need to manually list all your TS projects' inter-repo dependencies

## Speed

This is likely not the fastest way to build a mono-repo. However, it is intended to be most _stable_. After constantly fighting against `tsc`'s poor mono-repo tooling, and not desiring a full-blown mono-repo management tool (like Bazel) for simple projects, I finally built this.

## Installation

```bash
npm i tsc-mono
```

## Usage

It is recommended to first setup [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) (if you use npm) as you must use package name imports to import between each in-repo TS project.

```bash
tsc-mono <command> <command-inputs>
```

-   `<command>`: the `tsc-mono` command you wish to run.
-   `<command-inputs>`: inputs to the `tsc-mono` command in the bullet above. Currently there is only one command: `for-each`.

### `for-each`

`for-each` will run a given bash command for each TS project. The `<command-inputs>` are considered the bash command to run. Projects will be run in order based on their dependency graph.

Examples:

-   run type checking for each TS project:
    ```bash
    npx tsc-mono for-each tsc --noEmit
    ```
-   run "npm start" for each TS project:
    ```bash
    npx tsc-mono for-each npm start
    ```

## Full Example

To see an example repo setup that this package works for, go to this package's test files: https://github.com/electrovir/tsc-mono/tree/main/test-files/augment-vir

## Help output

Help message from the CLI:

```
tsc-mono usage:

tsc-mono <command> <command-inputs>

    - <command>: command that you want tsc-mono to run with this TS projects. Example: "for-each"
    - <command-inputs>: inputs for the given command. The options here will vary by command. Example: "npm run build"

Commands:

for-each
    - runs the given <command-inputs> as a bash script for each of the TS projects
    - projects are executed in dependency order

    Examples:
        - tsc-mono for-each npm run build
        - tsc-mono for-each "npm run build && echo success"

```
