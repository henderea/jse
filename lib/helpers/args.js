const shellEscape = require('any-shell-escape');
const _map = require('lodash/map');
const _flattenDeep = require('lodash/flattenDeep');

const preservePattern = /^(\||\d?>|<|\$\(|;|[&]{1,2}$|'.*'$|\[\[.*\]\]$|!!)/;

/*
 * wrapper class for already escaped/preserved values.
 * the `shell` function extracts the escaped/preserved value
 * from instances of this class rather than escaping them again
 */
class Escaped {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return this.value;
  }
}

/*
 * performs the following mappings on the supplied value(s):
 *
 * - already-escaped/preserved values are passed through verbatim
 * - null and undefined are ignored (i.e. mapped to empty arrays,
 *   which are pruned by flatten)
 * - non-strings are stringified e.g. false -> "false"
 *
 * then flattens the resulting array and returns its elements joined by a space
 */
function _shellEscape(params, options = {}) {
  let escaped = [__shellEscape(params, options)];
  let flattened = _flattenDeep(escaped);
  return flattened.join(' ');
}

/*
 * the (recursive) guts of _shellEscape. returns a leaf node (string)
 * or a possibly-empty array of arrays/leaf nodes. prunes
 * null and undefined by returning empty arrays
 */
function __shellEscape(params, options) {
  if(Array.isArray(params)) {
    return params.map((param) => __shellEscape(param, options));
  } else if(params == null) {
    return [];
  } else {
    return options.verbatim ? String(params) : shellEscape(String(params));
  }
}

let shell = {};

/*
 * helper function which escapes its parameters and prevents them
 * from being re-escaped
 */
shell.escape = function escape(...params) {
  return new Escaped(_shellEscape(params, { verbatim: false }));
};

shell.escapeList = function escapeList(...params) {
  let escaped = [__shellEscape(params, { verbatim: false })];
  return _flattenDeep(escaped);
};

/*
 * helper function which protects its parameters from being escaped
 */
shell.preserve = function verbatim(...params) {
  return new Escaped(_shellEscape(params, { verbatim: true }));
};

shell.protect = shell.verbatim = shell.preserve;

/**
 * @param {string[]} cmdArr
 * @param {string[]} arr
 * @param {boolean?} literal
 */
const arrayToArgs = async (cmdArr, arr, literal = false) => {
  return literal ? [...cmdArr, ...arr].join(' ') : shell.escape(_map([...cmdArr, ...arr], (v) => {
    return preservePattern.test(v) ? shell.preserve(v.startsWith('!!') ? v.splice(2) : v) : v;
  }));
};

module.exports = { arrayToArgs, shell };
