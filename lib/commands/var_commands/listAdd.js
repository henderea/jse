const chalk = require('chalk');
const { dataStore } = require('../../helpers/dataStore');

exports.command = ['list-add <name> <values..>'];
exports.describe = 'add/modify a variable default value list';

exports.builder = yargs => {
    return yargs.positional('name', {
        describe: 'the name of the variable'
    }).positional('values', {
        describe: 'the default value list of the variable'
    }).option('local', {
        describe: 'add/modify local variables',
        type: 'boolean'
    });
};

exports.handler = argv => {
    dataStore.vars.saveLocal = argv.local;
    let result = dataStore.vars.set(argv.name, argv.values);
    console.log(chalk.green(`${argv.name} ${result ? 'updated' : 'added'}`));
};