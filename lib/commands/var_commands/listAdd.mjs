import { styles } from '@henderea/simple-colors';
const { green } = styles;

import { vars, state } from '../../helpers/api.mjs';

const command = {};
command.command = ['list-add <name> <values..>'];
command.describe = 'add/modify a variable default value list';

command.builder = (yargs) => {
  return yargs.positional('name', {
    describe: 'the name of the variable'
  }).positional('values', {
    describe: 'the default value list of the variable'
  }).option('local', {
    describe: 'add/modify local variables',
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
  let result = vars.set(argv.name, argv.values);
  console.log(green(`${argv.name} ${result ? 'updated' : 'added'}`));
};

export default command;
