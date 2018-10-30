const shell = require('shell-escape-tag');
const _map = require('lodash/map');

const preservePattern = /^(\||\d?>|<|\$\(|;|[&]{1,2}$|'.*'$|\[\[.*\]\]$|!!)/;

const arrayToArgs = async (cmdArr, arr, literal = false, promptIfMissingRequired = false) => {
    return literal ? [...cmdArr, ...arr].join(' ') : shell.escape(_map([...cmdArr, ...arr], v => {
        return preservePattern.test(v) ? shell.preserve(v.startsWith('!!') ? v.splice(2) : v) : v;
    }));
}

module.exports = { arrayToArgs };