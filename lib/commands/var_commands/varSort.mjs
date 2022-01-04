import { styles } from '@henderea/simple-colors';
const { green } = styles;

import { vars, state } from '../../helpers/api.mjs';

const command = {};
command.command = ['var-sort'];
command.describe = 'sort the variables in the vars.jse.json file';

command.builder = (yargs) => {
  return yargs.option('local', {
    describe: 'sort the variables in the local vars.jse.json file',
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
  vars.sortVars();
  console.log(green(`Vars sorted`));
};

export default command;
