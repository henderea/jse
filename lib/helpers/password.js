const keytar = require('keytar');
const child_process = require('child_process');
const os = require('os');
const util = require('util');
const exec = util.promisify(child_process.exec);
const inquirer = require('inquirer');
const { arrayToArgs } = require('./args');

const user = os.userInfo().username;
/**
 * @returns {string}
 */
const get = async () => await keytar.getPassword('jse', user);
/**
 * @param {string} pw
 * @returns {boolean}
 */
const set = async (pw) => {
    await keytar.setPassword('jse', user, pw);
    return test(pw);
};
/**
 * @returns {boolean}
 */
const remove = async () => {
    let result = await keytar.deletePassword('jse', user);
    if(!result) {
        return null;
    }
    let pw = await get();
    return !pw;
};
/**
 * @param {string?} pw
 */
const test = async (pw = null) => {
    let { stdout } = await exec(pw ? `echo '${pw}' | sudo -S echo "Success" 2>&1` : 'sudo echo "Success" 2>&1');
    return stdout && stdout.includes('Success');
}
/**
 * @returns {string}
 */
const prompt = async () => {
    let p = inquirer.createPromptModule();
    let valid = false;
    let pw = null;
    while(!valid) {
        let { password } = await p({ type: 'password', name: 'password', message: `Password for user ${user}` });
        pw = password;
        valid = test(pw);
    }
    return pw;
}

/**
 * @returns {boolean}
 */
const hasRvmSudo = async () => {
    let { stdout } = await exec('which rvmsudo');
    return stdout && stdout.includes('rvmsudo');
};

/**
 * @param {string} sudoCommand
 * @param {string} cmd
 * @param {string[]} cmdArgs
 * @param {string[]} args
 * @param {boolean?} interactive
 * @returns {number} the exit code
 */
const runSudo = async (sudoCommand, cmd, cmdArgs, args, interactive = null) => {
    let arr = await arrayToArgs(cmdArgs, args);
    let pass = await get();
    if(!pass) {
        pass = await prompt();
    } else if(!test(pass)) {
        console.log(chalk.red('Stored password invalid!'));
        pass = await prompt();
    }
    if(sudoCommand != 'rvmsudo' && !(await hasRvmSudo())) {
        sudoCommand = 'sudo';
    }
    try {
        child_process.execSync(test() ? `${sudoCommand} ${cmd} ${arr}` : `echo '${pass}' | ${sudoCommand} -S ${cmd} ${arr}`, { stdio: 'inherit' });
        return 0;
    } catch(e) {
        return e.status;
    }
}

module.exports = { user, get, set, remove, test, prompt, hasRvmSudo, runSudo };