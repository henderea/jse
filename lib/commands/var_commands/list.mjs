import _maxBy from 'lodash/maxBy.js';
import _each from 'lodash/each.js';
import _isArray from 'lodash/isArray.js';
import _pick from 'lodash/pick.js';

import { styles } from '@henderea/simple-colors';
const { yellow } = styles;

import { vars, state } from '../../helpers/api.mjs';

const command = {};
command.command = ['list [name]', 'ls'];
command.describe = 'list the variables with defaults, optionally filtering by variable name';

command.builder = (yargs) => {
  return yargs.positional('name', {
    describe: 'the partial search term to use for finding variables'
  }).option('local', {
    describe: 'get local variables only',
    type: 'boolean'
  }).option('global', {
    describe: 'get global variables only',
    type: 'boolean'
  }).option('wd', {
    alias: 'working-directory',
    describe: 'use a different working directory',
    type: 'string'
  });
};

command.handler = (argv) => {
  state.wdOverride = argv.wd;
  const options = _pick(argv, 'local', 'global');
  let varList = vars.search(argv.name, options);
  if(!varList || varList.length == 0) {
    console.log(yellow(`Did not find any variables matching ${argv.name || '*'}`));
  } else {
    let longestVar = _maxBy(varList, (v) => `${v}`.length).length;
    _each(varList, (v) => {
      let val = vars.find(v, options);
      if(_isArray(val)) {
        val = JSON.stringify(val);
      }
      console.log(`${v.padEnd(longestVar, ' ')} => ${val}`);
    });
  }
};

export default command;
