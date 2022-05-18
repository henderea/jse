import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import about from '../lib/commands/about.mjs';
import shell from '../lib/commands/shell.mjs';
import varCommand from '../lib/commands/var.mjs';

yargs(hideBin(process.argv))
  .parserConfiguration({
    'unknown-options-as-args': true
  })
  .usage('Usage: $0 command [args]')
  .wrap(120)
  .command(about)
  .command(shell)
  .command(varCommand)
  .help('help')
  .argv;
