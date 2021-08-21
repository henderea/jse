import { aboutText } from '../helpers/about.mjs';

const command = {};
command.command = ['about'];
command.describe = 'Print out basic about info';

command.builder = {};

command.handler = () => {
  console.log(aboutText);
};

export default command;
