#!/usr/bin/env node
import yargs from 'yargs';
import spawn from 'cross-spawn';
import chalk from 'chalk';
import path from 'path';

import { log } from '../utilities';
import pkg from '../../package.json';

const runCommand = ({ command, message, args }) => {
  log({ title: command, message, useSeparator: true });
  spawn(
    'node',
    [
      // Run command via bootstrapped node environment
      path.resolve(__dirname, 'bootstrap.js'),
      // We append any existing arguments to run the command with
      ...args,
      // And add color support for dependency-modules like `chalk`
      '--color',
    ],
    {
      env: {
        // Transfer existing environment variables to called command
        ...process.env,

        // Toolkit-related environment variables
        TOOLKIT_COMMAND: command,
        // TOOLKIT_BABEL_RC: babelrc,
        // TOOLKIT_NODE_HOOKS: nodeHooks,

        // Make sure node knows about root-relative imports by giving setting the current path
        NODE_PATH: path.resolve(process.cwd()),
      },

      // OSX will throw error if shell is not set
      shell: process.platform !== 'win32',
      stdio: 'inherit',
    },
  );
};

const devToolkit = ({ cmdArgs }) => {
  const processedArgs = yargs
    .alias('w', 'watch')
    .alias('b', 'build')
    .alias('i', 'init')
    .alias('s', 'serve')
    .alias('static', 'serve-static')
    .parse(cmdArgs);

  // Outputs current version number from `package.json`
  if (processedArgs.v || processedArgs.version) {
    log({ message: `\n\n[${chalk.magenta(`${pkg.name} v${pkg.version}`)}]\n\n` });
  }

  // runs corresponding command inside `src/commands`-folder
  if (processedArgs.watch) {
    runCommand({
      command: 'watch',
      message: 'Watching files for development',
      args: [processedArgs.watch],
    });
  }
  if (processedArgs.serve) {
    runCommand({
      command: 'serve',
      message: 'Watching files for development',
      args: [processedArgs.serve],
    });
  }
  if (processedArgs['serve-static']) {
    log({ message: 'This command is not meant for production use.', type: 'warning' });
    runCommand({
      command: 'serveStatic',
      message: 'Serving the /build folder using a minimal server',
      args: [processedArgs['serve-static']],
    });
  }
  if (processedArgs.init) {
    runCommand({
      command: 'init',
      message: 'Initializing new project',
      args: [processedArgs.init],
    });
  }
  if (processedArgs.build) {
    runCommand({
      command: 'build',
      message: `Creating a static build${(processedArgs.dynamic ? ' with dynamic pages' : '')}`,
      args: [(processedArgs.dynamic ? 'dynamic' : '')],
    });
  }
};

// Run toolkit immediately using yargs if we're not testing it
if (!process.env.TOOLKIT_TEST) {
  devToolkit({ cmdArgs: process.argv });
}

export default devToolkit;
