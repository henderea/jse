#!/usr/bin/env node
const yargs = require('yargs');
const path = require('path');
const argv = yargs
    .usage('Usage: $0 command [args]')
    .wrap(120)
    .commandDir(path.join(__dirname, '../lib/commands'))
    .help('h')
    .alias('h', 'help')
    .argv;