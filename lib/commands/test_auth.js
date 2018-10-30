const pw = require('../helpers/password');
const chalk = require('chalk');

exports.command = ['test-auth'];
exports.describe = 'test stored password';

exports.builder = {};

exports.handler = async argv => {
    let pass = await pw.get();
    if(!pass) {
        console.log(chalk.yellow('You need to call "jse auth" first!'));
    } else {
        console.log(pw.test(pass) ? chalk.green('Success!') : chalk.red('Failure!'));
    }
};