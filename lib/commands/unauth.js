const pw = require('../helpers/password');
const chalk = require('chalk');

exports.command = ['unauth'];
exports.describe = 'remove stored password from keychain';

exports.builder = {};

exports.handler = async () => {
  let result = await pw.remove();
  if(result === null) {
    console.log(chalk.yellow('No stored password!'));
  } else if(result) {
    console.log(chalk.green('Password forgotten'));
  } else {
    console.log(chalk.red('Failure to forget password'));
  }
};
