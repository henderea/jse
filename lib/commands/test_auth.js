const pw = require('../helpers/password');

exports.command = ['test-auth'];
exports.describe = 'test stored password';

exports.builder = {};

exports.handler = async argv => {
    let pass = await pw.get();
    if(!pass) {
        console.log('You need to call "jse auth" first!');
    } else {
        console.log(pw.test(pass) ? 'Success!' : 'Failure!')
    }
};