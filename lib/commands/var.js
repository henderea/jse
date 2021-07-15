exports.command = ['var COMMAND ARGS...', 'variable', 'v'];
exports.describe = 'configure stored variables';

exports.builder = (yargs) => yargs
  .command(require('./var_commands/add'))
  .command(require('./var_commands/get'))
  .command(require('./var_commands/list'))
  .command(require('./var_commands/listAdd'))
  .command(require('./var_commands/listSort'))
  .command(require('./var_commands/mod'))
  .command(require('./var_commands/remove'))
  .command(require('./var_commands/varSort'));

exports.handler = () => {};
