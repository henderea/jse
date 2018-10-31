const chalk = require('chalk');
const { dataStore } = require('../../helpers/dataStore');

exports.command = ['var-sort'];
exports.describe = 'sort the variables in the vars.jse.json file';

exports.builder = yargs => {
    return yargs.option('local', {
        describe: 'sort the variables in the local vars.jse.json file',
        type: 'boolean'
    });
};

exports.handler = argv => {
    dataStore.vars.saveLocal = argv.local;
    dataStore.vars.searchLocal = argv.local;
    dataStore.vars.sortVars();
    console.log(chalk.green(`Vars sorted`));
};