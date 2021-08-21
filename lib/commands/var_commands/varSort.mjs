import { styles } from '@henderea/simple-colors';
const { green } = styles;

import { vars } from '../../helpers/api.mjs';

const command = {};
command.command = ['var-sort'];
command.describe = 'sort the variables in the vars.jse.json file';

command.builder = (yargs) => {
  return yargs.option('local', {
    describe: 'sort the variables in the local vars.jse.json file',
    type: 'boolean'
  });
};

command.handler = (argv) => {
  vars.setLocal(argv.local);
  vars.sortVars();
  console.log(green(`Vars sorted`));
};

export default command;
