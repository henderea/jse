const keytar = require('keytar');
const child_process = require('child_process');
const os = require('os');
const inquirer = require('inquirer');

const user = os.userInfo().username;
const get = async () => await keytar.getPassword('jse', user);
const set = async (pw) => {
    await keytar.setPassword('jse', user, pw);
    return test(pw);
};
const remove = async () => {
    let result = await keytar.deletePassword('jse', user);
    if(!result) {
        return null;
    }
    let pw = await get();
    return !pw;
};
const test = (pw) => {
    let result = child_process.execSync(pw ? `echo '${pw}' | sudo -S echo "Success" 2>&1` : 'sudo echo "Success" 2>&1');
    return result && result.includes('Success');
}
const prompt = async () => {
    let p = inquirer.createPromptModule();
    let valid = false;
    let pw = null;
    while(!valid) {
        let { password } = await p({type: 'password', name: 'password', message: `Password for user ${user}`});
        pw = password;
        valid = test(pw);
    }
    return pw;
}

module.exports = { user, get, set, remove, test, prompt };