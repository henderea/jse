const chalk = require('chalk');
const { vars } = require('../../helpers/api');

exports.command = ['var-sort'];
exports.describe = 'sort the variables in the vars.jse.json file';

exports.builder = (yargs) => {
  return yargs.option('local', {
    describe: 'sort the variables in the local vars.jse.json file',
    type: 'boolean'
  });
};

exports.handler = (argv) => {
  vars.setLocal(argv.local);
  vars.sortVars();
  console.log(chalk.green(`Vars sorted`));
};
