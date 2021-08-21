import _maxBy from 'lodash/maxBy.js';
import _each from 'lodash/each.js';
import _isArray from 'lodash/isArray.js';

import { styles } from '@henderea/simple-colors';
const { yellow } = styles;

import { vars } from '../../helpers/api.mjs';

const command = {};
command.command = ['list [name]', 'ls'];
command.describe = 'list the variables with defaults, optionally filtering by variable name';

command.builder = (yargs) => {
  return yargs.positional('name', {
    describe: 'the partial search term to use for finding variables'
  }).option('local', {
    describe: 'get local variables',
    type: 'boolean'
  });
};

command.handler = (argv) => {
  vars.searchLocal = argv.local;
  let varList = vars.search(argv.name);
  if(!varList || varList.length == 0) {
    console.log(yellow(`Did not find any variables matching ${argv.name || '*'}`));
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

export default command;
