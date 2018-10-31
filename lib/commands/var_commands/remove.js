const chalk = require('chalk');
const { dataStore } = require('../../helpers/dataStore');

exports.command = ['remove <name>', 'rm', 'delete'];
exports.describe = 'remove a variable default value';

exports.builder = yargs => {
    return yargs.positional('name', {
        describe: 'the name of the variable'
    }).option('local', {
        describe: 'remove local variables',
        type: 'boolean'
    });
};

exports.handler = argv => {
    dataStore.vars.saveLocal = argv.local;
    let result = dataStore.vars.delete(argv.name);
    if(result) {
        console.log(chalk.green(`${argv.name} deleted`));
    } else {
        console.log(chalk.red(`${argv.name} not found`));
    }
};