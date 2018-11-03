#!/usr/bin/env node
// const yargs = require('yargs');
const path = require('path');
const Command = require('@henderea/commander').Command;
const program = new Command();
const test = new Command();
test
    .unknownOptionAsArg(true)
    .command('test2 <cmd> [args...]')
    .action((cmd, args) => {
        console.log('test2', cmd, args);
    });
test
    .command('test3 <cmd> [args...]')
    .action((cmd, args) => {
        console.log('test3', cmd, args);
    });

program
    .version(require(path.join(__dirname, '../package.json')).version)
    .unknownOptionAsArg(true)
    .command('test <cmd> [args...]', 'test command', { exec: test });

program.parse(process.argv);

// const argv = yargsy
//     .usage('Usage: $0 command [args]')
//     .wrap(120)
//     .commandDir(path.join(__dirname, '../lib/commands'))
//     .help('h')
//     .alias('h', 'help')
//     .argv;