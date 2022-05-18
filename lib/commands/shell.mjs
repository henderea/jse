import { shellCode, JSE_SHELL_REVISION } from '../helpers/shell.mjs';

const command = {};
command.command = ['shell'];
command.describe = `Print out shell integration code.`;

command.builder = (yargs) => {
  return yargs.epilogue(`To use in your shell, add
  eval "$(jse shell)"
to your shell initialization script. 
The shell integration will automatically reload starting with jse version 0.7.1
You can force a reload with
  jse reload`).option('revision', {
    describe: 'Show the shell integration revision number',
    type: 'boolean'
  });
};

command.handler = (argv) => {
  if(argv.revision) {
    console.log(JSE_SHELL_REVISION);
  } else {
    process.stdout.write(shellCode);
  }
};

export default command;
