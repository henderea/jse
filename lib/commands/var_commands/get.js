const chalk = require('chalk');
const { dataStore } = require('../../helpers/dataStore');
const _isArray = require('lodash/isArray');

exports.command = ['get <name>'];
exports.describe = 'get a variable default value';

exports.builder = yargs => {
    return yargs.positional('name', {
        describe: 'the name of the variable'
    }).option('local', {
        describe: 'get local variables',
        type: 'boolean'
    }).option('global', {
        describe: 'get global variables',
        type: 'boolean'
    });
};

exports.handler = argv => {
    dataStore.vars.searchLocal = argv.local;
    if(argv.local && !argv.global && !dataStore.vars.hasLocal(argv.name)) {
        console.error(chalk.red(`${argv.name} not found locally`));
    } else if(!argv.local && argv.global && !dataStore.vars.hasGlobal(argv.name)) {
        console.error(chalk.red(`${argv.name} not found globally`));
    } else if(((argv.local && argv.global) || (!argv.local && !argv.global)) && !dataStore.vars.has(argv.name)) {
        console.error(chalk.red(`${argv.name} not found`));
    } else if(dataStore.vars.has(argv.name)) {
        let val = dataStore.vars.get(argv.name);
        if(_isArray(val)) {
            val = val.join(', ');
        }
        console.log(val);
    } else {
        console.error(chalk.red(`${argv.name} not found`));
    }
};