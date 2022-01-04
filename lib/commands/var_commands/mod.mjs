import _pick from 'lodash/pick.js';

import { styles } from '@henderea/simple-colors';
const { red, green, bold } = styles;

import { vars, state } from '../../helpers/api.mjs';

const command = {};
command.command = ['mod <name> <value>'];
command.describe = 'modify a variable default value';

command.builder = (yargs) => {
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
  }).option('wd', {
    alias: 'working-directory',
    describe: 'use a different working directory',
    type: 'string'
  });
};

command.handler = (argv) => {
  try {
    state.wdOverride = argv.wd;
    vars.setLocal(argv.local);
    const options = _pick(argv, 'plus', 'minus', 'append', 'prepend', 'regexCut');
    const { oldValue, newValue } = vars.mod(argv.name, argv.value, options);
    console.log(green(`${bold(argv.name)} updated from ${bold(oldValue)} to ${bold(newValue)}`));
  } catch (e) {
    console.error(red(e.message));
    process.exit(1);
  }
};

export default command;
