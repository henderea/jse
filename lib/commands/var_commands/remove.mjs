import { styles } from '@henderea/simple-colors';
const { red, green } = styles;

import { vars } from '../../helpers/api.mjs';

const command = {};
command.command = ['remove <name>', 'rm', 'delete'];
command.describe = 'remove a variable default value';

command.builder = (yargs) => {
  return yargs.positional('name', {
    describe: 'the name of the variable'
  }).option('local', {
    describe: 'remove local variables',
    type: 'boolean'
  });
};

command.handler = (argv) => {
  vars.saveLocal = argv.local;
  let result = vars.delete(argv.name);
  if(result) {
    console.log(green(`${argv.name} deleted`));
  } else {
    console.log(red(`${argv.name} not found`));
  }
};

export default command;
