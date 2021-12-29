import { orderBy } from 'natural-orderby';

import _pick from 'lodash/pick.js';
import _flatMap from 'lodash/flatMap.js';
import _uniq from 'lodash/uniq.js';

import { styles } from '@henderea/simple-colors';
const { red } = styles;

import { vars, shell } from '../../helpers/api.mjs';

const command = {};
command.command = ['get-all [names..]'];
command.describe = 'get values for a set of variables';

command.builder = (yargs) => {
  return yargs.positional('names', {
    describe: 'the names of the variables'
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
  }).option('unique', {
    describe: 'only get unique values',
    type: 'boolean'
  }).option('sort', {
    describe: 'sort values',
    type: 'boolean'
  });
};

command.handler = (argv) => {
  try {
    const options = _pick(argv, 'local', 'global');
    let val = _flatMap(argv.names, (name) => {
      try {
        return vars.find(name, options);
      } catch (e) {
        console.error(red(e.message));
      }
      return [];
    });
    if(argv.unique) {
      val = _uniq(val);
    }
    if(argv.sort) {
      val = orderBy(val, [(v) => v.replace(/[_-]/g, ' '), (v) => v]);
    }
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
    console.log(val);
  } catch (e) {
    console.error(red(e.message));
  }
};

export default command;
