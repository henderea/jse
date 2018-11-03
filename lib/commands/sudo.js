const pw = require('../helpers/password');

exports.command = ['sudo <command> [args..]', 's'];
exports.describe = 'run a sudo with the stored password filled in for you';

exports.builder = yargs => {
    return yargs.positional('command', {
        describe: 'The executable to run'
    }).positional('args', {
        describe: 'The arguments to the executable'
    }).option('rvm-sudo', {
        describe: 'use rvmsudo instead of sudo',
        type: 'boolean'
    });
};

exports.handler = async argv => {
    console.log(argv);
    let status = await pw.runSudo(argv.rvmSudo ? 'rvmsudo' : 'sudo', argv.command, argv.args, []);
    process.exit(status);
};