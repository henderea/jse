const pw = require('../helpers/password');
const chalk = require('chalk');

exports.command = ['auth'];
exports.describe = 'authenticate and save password in keychain';

exports.builder = {};

exports.handler = async () => {
  let pass = await pw.prompt();
  let result = await pw.set(pass);
  console.log(result ? chalk.green('Success!') : chalk.red('Failure!'));
};
