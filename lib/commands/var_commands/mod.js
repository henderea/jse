const chalk = require('chalk');
const { dataStore } = require('../../helpers/dataStore');
const _isNaN = require('lodash/isNaN');

exports.command = ['mod <name> <value>'];
exports.describe = 'modify a variable default value';

exports.builder = yargs => {
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
    });
};

exports.handler = argv => {
    if((argv.plus || argv.minus) && _isNaN(parseFloat(argv.value))) {
        console.log(chalk.red('When using --plus or --minus, <value> must be a number'));
        process.exit(1);
    }
    dataStore.vars.saveLocal = argv.local;
    let val = dataStore.vars.get(argv.name);
    let pattern = /^-?(\d+([.]\d+)?|[.]\d+)$/;
    let newVal = argv.value;
    if(argv.plus || argv.minus) {
        if(pattern.test(val)) {
            newVal = String(parseFloat(val) + (argv.value * (argv.minus ? -1 : 1)));
        } else {
            console.log(chalk.red(`Variable ${chalk.bold(argv.name)} is not numeric`));
            process.exit(1);
        }
    }
    dataStore.vars.set(argv.name, newVal);
    console.log(chalk.green(`${chalk.bold(argv.name)} updated from ${chalk.bold(val)} to ${chalk.bold(newVal)}`));
};