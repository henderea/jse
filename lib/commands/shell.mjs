import { shellCode } from '../helpers/shell.mjs';

const command = {};
command.command = ['shell'];
command.describe = 'print out shell integration code. add `eval "$(jse shell)"` to your shell initialization script';

command.handler = () => {
  process.stdout.write(shellCode);
};

export default command;
