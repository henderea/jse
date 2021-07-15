const chalk = require('chalk');
const { vars } = require('../../helpers/api');

exports.command = ['list-sort <name>'];
exports.describe = 'sort a variable default value list';

exports.builder = (yargs) => {
  return yargs.positional('name', {
    describe: 'the name of the variable'
  }).option('local', {
    describe: 'sort local variables',
    type: 'boolean'
  });
};

exports.handler = (argv) => {
  vars.setLocal(argv.local);
  const result = vars.listSort(argv.name);
  if(result) {
    console.log(chalk.green(`${argv.name} sorted`));
  } else {
    console.log(chalk.yellow(`${argv.name} not an array variable`));
  }
};
