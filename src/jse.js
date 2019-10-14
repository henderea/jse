const yargs = require('yargs');
const path = require('path');
const argv = yargs
    .parserConfiguration({
        'unknown-options-as-args': true
    })
    .usage('Usage: $0 command [args]')
    .wrap(120)
    .command(require('../lib/commands/about'))
    .command(require('../lib/commands/auth'))
    .command(require('../lib/commands/sudo'))
    .command(require('../lib/commands/test_auth'))
    .command(require('../lib/commands/unauth'))
    .command(require('../lib/commands/var'))
    .help('help')
    .argv;