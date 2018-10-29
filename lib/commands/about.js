const { aboutText } = require('../helpers/about');

exports.command = ['about'];
exports.describe = 'Print out basic about info';

exports.builder = {};

exports.handler = argv => {
    console.log(aboutText);
};