import add from './var_commands/add.mjs';
import get from './var_commands/get.mjs';
import list from './var_commands/list.mjs';
import listAdd from './var_commands/listAdd.mjs';
import listSort from './var_commands/listSort.mjs';
import mod from './var_commands/mod.mjs';
import remove from './var_commands/remove.mjs';
import varSort from './var_commands/varSort.mjs';

const command = {};
command.command = ['var COMMAND ARGS...', 'variable', 'v'];
command.describe = 'configure stored variables';

command.builder = (yargs) => yargs
  .command(add)
  .command(get)
  .command(list)
  .command(listAdd)
  .command(listSort)
  .command(mod)
  .command(remove)
  .command(varSort);

command.handler = () => {};

export default command;
