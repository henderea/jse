import { styles } from '@henderea/simple-colors';
const { green } = styles;

import { vars } from '../../helpers/api.mjs';

const command = {};
command.command = ['add <name> <value>'];
command.describe = 'add/modify a variable default value';

command.builder = (yargs) => {
  return yargs.positional('name', {
    describe: 'the name of the variable'
  }).positional('value', {
    describe: 'the default value of the variable'
  }).option('local', {
    describe: 'add/modify local variables',
    type: 'boolean'
  });
};

command.handler = (argv) => {
  vars.saveLocal = argv.local;
  let result = vars.set(argv.name, argv.value);
  console.log(green(`${argv.name} ${result ? 'updated' : 'added'}`));
};

export default command;
