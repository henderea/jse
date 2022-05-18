import { shellCode, JSE_SHELL_REVISION } from '../helpers/shell.mjs';

const command = {};
command.command = ['shell'];
command.describe = 'print out shell integration code.\nTo use in your shell, add\n  eval "$(jse shell)"\nto your shell initialization script';

command.builder = (yargs) => {
  return yargs.option('revision', {
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
