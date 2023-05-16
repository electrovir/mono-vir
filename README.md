# mono-vir

Super simple npm mono-repo tooling.

Uses npm workspaces and `package.json` dependencies to determine build order.

## Features

-   runs commands for each package in correct order based on each package's dependency graph
-   relies on `package.json`'s `workspaces` property: no need to duplicate this information in another config
-   [TSConfig reference paths](https://www.typescriptlang.org/docs/handbook/project-references.html) are not required
-   [TSConfig `composite` option](https://www.typescriptlang.org/tsconfig#composite) is not required
-   [TSConfig `declarationMap` option](https://www.typescriptlang.org/tsconfig#declarationMap) is not required

## Installation

```bash
npm i mono-vir
```

## Usage

Note: You must first setup [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) (use a `workspaces` property in your `package.json`).

```bash
mono-vir <command> <command-inputs>
```

-   `<command>`: the `mono-vir` command you wish to run.
-   `<command-inputs>`: inputs to the `mono-vir` command in the bullet above.

### `for-each`

`for-each` will run a given bash command for each workspace package. The `<command-inputs>` are considered the bash command to run. Projects will be run in order based on their dependency graph.

Examples:

-   run type checking for each workspace package:
    ```bash
    npx mono-vir for-each tsc --noEmit
    ```
-   run "npm start" for each workspace package:
    ```bash
    npx mono-vir for-each npm start
    ```

### `for-each-async`

`for-each-async` is exactly the same as `for-each` but it runs the command for each package in parallel.

## Full Example

To see an example repo setup that this package works for, go to this package's test files: https://github.com/electrovir/mono-vir/tree/main/test-files/augment-vir
