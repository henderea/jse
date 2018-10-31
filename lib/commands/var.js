const path = require('path');

exports.command = ['var COMMAND ARGS...', 'variable', 'v'];
exports.describe = 'configure stored variables';

exports.builder = yargs => yargs.commandDir(path.join(__dirname, './var_commands'));

exports.handler = argv => {};