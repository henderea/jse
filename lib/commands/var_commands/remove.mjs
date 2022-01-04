import { styles } from '@henderea/simple-colors';
const { red, green } = styles;

import { vars, state } from '../../helpers/api.mjs';

const command = {};
command.command = ['remove <name>', 'rm', 'delete'];
command.describe = 'remove a variable default value';

command.builder = (yargs) => {
  return yargs.positional('name', {
    describe: 'the name of the variable'
  }).option('local', {
    describe: 'remove local variables',
    type: 'boolean'
  }).option('wd', {
    alias: 'working-directory',
    describe: 'use a different working directory',
    type: 'string'
  });
};

command.handler = (argv) => {
  state.wdOverride = argv.wd;
  vars.saveLocal = argv.local;
  let result = vars.delete(argv.name);
  if(result) {
    console.log(green(`${argv.name} deleted`));
  } else {
    console.log(red(`${argv.name} not found`));
  }
};

export default command;
