import _isArray from 'lodash/isArray.js';
import _pick from 'lodash/pick.js';

import { styles } from '@henderea/simple-colors';
const { red } = styles;

import { vars, shell, state } from '../../helpers/api.mjs';

const command = {};
command.command = ['get <name>'];
command.describe = 'get a variable default value';

command.builder = (yargs) => {
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
  }).option('wd', {
    alias: 'working-directory',
    describe: 'use a different working directory',
    type: 'string'
  });
};

command.handler = (argv) => {
  try {
    state.wdOverride = argv.wd;
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
    console.error(red(e.message));
  }
};

export default command;
