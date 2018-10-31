const chalk = require('chalk');
const { dataStore } = require('../../helpers/dataStore');
const _filter = require('lodash/filter');
const _sortBy = require('lodash/sortBy');
const _maxBy = require('lodash/max');
const _each = require('lodash/each');
const _isArray = require('lodash/isArray');

exports.command = ['list [name]', 'ls'];
exports.describe = 'list the variables with defaults, optionally filtering by variable name';

exports.builder = yargs => {
    return yargs.positional('name', {
        describe: 'the partial search term to use for finding variables'
    });
};

exports.handler = argv => {
    let vars = dataStore.vars.keys;
    let regex = new RegExp('.*' + (argv.name || '') + '.*');
    vars = _filter(vars, v => regex.test(v));
    vars = _sortBy(vars);
    if(!vars || vars.length == 0) {
        console.log(chalk.yellow(`Did not find any variables matching ${argv.name || '*'}`));
    } else {
        let longestVar = _maxBy(vars, v => `${v}`.length);
        _each(vars, v => {
            let val = dataStore.vars.get(v);
            if(_isArray(val)) {
                val = val.join(', ');
            }
            console.log(`${v.padEnd(longestVar)} => ${val}`);
        });
    }
};