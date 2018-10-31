const chalk = require('chalk');
const { dataStore } = require('../../helpers/dataStore');

exports.command = ['add <name> <value>'];
exports.describe = 'add/modify a variable default value';

exports.builder = yargs => {
    return yargs.positional('name', {
        describe: 'the name of the variable'
    }).positional('value', {
        describe: 'the default value of the variable'
    }).option('local', {
        describe: 'add/modify local variables',
        type: 'boolean'
    });
};

exports.handler = argv => {
    dataStore.vars.saveLocal = argv.local;
    let result = dataStore.vars.set(argv.name, argv.value);
    console.log(chalk.green(`${argv.name} ${result ? 'updated' : 'added'}`));
};