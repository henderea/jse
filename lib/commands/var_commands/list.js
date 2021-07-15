const chalk = require('chalk');
const { vars } = require('../../helpers/api');
const _maxBy = require('lodash/maxBy');
const _each = require('lodash/each');
const _isArray = require('lodash/isArray');

exports.command = ['list [name]', 'ls'];
exports.describe = 'list the variables with defaults, optionally filtering by variable name';

exports.builder = (yargs) => {
  return yargs.positional('name', {
    describe: 'the partial search term to use for finding variables'
  }).option('local', {
    describe: 'get local variables',
    type: 'boolean'
  });
};

exports.handler = (argv) => {
  vars.searchLocal = argv.local;
  let varList = vars.search(argv.name);
  if(!varList || varList.length == 0) {
    console.log(chalk.yellow(`Did not find any variables matching ${argv.name || '*'}`));
  } else {
    let longestVar = _maxBy(varList, (v) => `${v}`.length).length;
    _each(varList, (v) => {
      let val = vars.get(v);
      if(_isArray(val)) {
        val = JSON.stringify(val);
      }
      console.log(`${v.padEnd(longestVar, ' ')} => ${val}`);
    });
  }
};
