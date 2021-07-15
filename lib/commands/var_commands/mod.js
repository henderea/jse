const chalk = require('chalk');
const { vars } = require('../../helpers/api');
const _pick = require('lodash/pick');

exports.command = ['mod <name> <value>'];
exports.describe = 'modify a variable default value';

exports.builder = (yargs) => {
  return yargs.positional('name', {
    describe: 'the name of the variable'
  }).positional('value', {
    describe: 'the default value of the variable',
    type: 'string'
  }).option('local', {
    describe: 'modify local variables',
    type: 'boolean'
  }).option('plus', {
    describe: 'instead of setting the variable to <value>, add <value> to the current value of the variable',
    type: 'boolean',
    alias: ['p']
  }).option('minus', {
    describe: 'instead of setting the variable to <value>, subtract <value> from the current value of the variable',
    type: 'boolean',
    alias: ['m']
  }).option('append', {
    describe: 'instead of setting the variable to <value>, append <value> to the end of the current value of the variable',
    type: 'boolean',
    alias: ['end', 'e']
  }).option('prepend', {
    describe: 'instead of setting the variable to <value>, prepend <value> to the start of the current value of the variable',
    type: 'boolean',
    alias: ['start', 's']
  }).option('regex-cut', {
    describe: 'instead of setting the variable to <value>, cut out the portion of the current value of the variable that is matched by the regex <value>',
    type: 'boolean',
    alias: ['c']
  });
};

exports.handler = (argv) => {
  try {
    vars.setLocal(argv.local);
    const options = _pick(argv, 'plus', 'minus', 'append', 'prepend', 'regexCut');
    const { oldValue, newValue } = vars.mod(argv.name, argv.value, options);
    console.log(chalk.green(`${chalk.bold(argv.name)} updated from ${chalk.bold(oldValue)} to ${chalk.bold(newValue)}`));
  } catch (e) {
    console.error(chalk.red(e.message));
    process.exit(1);
  }
};
