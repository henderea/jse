import { styles } from '@henderea/simple-colors';
const { yellow, green } = styles;

import { vars, state } from '../../helpers/api.mjs';

const command = {};
command.command = ['list-sort <name>'];
command.describe = 'sort a variable default value list';

command.builder = (yargs) => {
  return yargs.positional('name', {
    describe: 'the name of the variable'
  }).option('local', {
    describe: 'sort local variables',
    type: 'boolean'
  }).option('wd', {
    alias: 'working-directory',
    describe: 'use a different working directory',
    type: 'string'
  });
};

command.handler = (argv) => {
  state.wdOverride = argv.wd;
  vars.setLocal(argv.local);
  const result = vars.listSort(argv.name);
  if(result) {
    console.log(green(`${argv.name} sorted`));
  } else {
    console.log(yellow(`${argv.name} not an array variable`));
  }
};

export default command;
