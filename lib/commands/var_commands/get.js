const chalk = require('chalk');
const { vars, shell } = require('../../helpers/api');
const _isArray = require('lodash/isArray');
const _pick = require('lodash/pick');

exports.command = ['get <name>'];
exports.describe = 'get a variable default value';

exports.builder = (yargs) => {
  return yargs.positional('name', {
    describe: 'the name of the variable'
  }).option('local', {
    describe: 'get local variables',
    type: 'boolean'
  }).option('global', {
    describe: 'get global variables',
    type: 'boolean'
  }).option('lines', {
    describe: 'show list variables with one entry per line',
    type: 'boolean'
  }).option('escaped', {
    describe: 'apply shell escapes to the variable value(s)',
    type: 'boolean'
  });
};

exports.handler = (argv) => {
  try {
    const options = _pick(argv, 'local', 'global');
    let val = vars.find(argv.name, options);
    if(_isArray(val)) {
      if(argv.lines) {
        if(argv.escaped) {
          val = shell.escapeList(val);
        }
        val = val.join('\n');
      } else if(argv.escaped) {
        val = String(shell.escape(val));
      } else {
        val = JSON.stringify(val);
      }
    } else if(argv.escaped) {
      val = String(shell.escape(val));
    }
    console.log(val);
  } catch (e) {
    console.error(chalk.red(e.message));
  }
};
