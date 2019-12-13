const chalk = require('chalk');
const { dataStore } = require('../../helpers/dataStore');
const _isArray = require('lodash/isArray');
const { orderBy } = require('natural-orderby')

exports.command = ['list-sort <name>'];
exports.describe = 'sort a variable default value list';

exports.builder = yargs => {
    return yargs.positional('name', {
        describe: 'the name of the variable'
    }).option('local', {
        describe: 'sort local variables',
        type: 'boolean'
    });
};

exports.handler = argv => {
    dataStore.vars.saveLocal = argv.local;
    dataStore.vars.searchLocal = argv.local;
    let arr = dataStore.vars.get(argv.name);
    if(_isArray(arr)) {
        dataStore.vars.set(argv.name, orderBy(arr, [v => v.replace(/[_-]/g, ' '), v => v]));
    }
    console.log(chalk.green(`${argv.name} sorted`));
};