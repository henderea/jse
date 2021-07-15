const { dataStore } = require('./dataStore');
const { shell } = require('./args');
const _extend = require('lodash/extend');
const _isNaN = require('lodash/isNaN');
const _isArray = require('lodash/isArray');
const _filter = require('lodash/filter');
const _sortBy = require('lodash/sortBy');
const _isRegExp = require('lodash/isRegExp');
const { orderBy } = require('natural-orderby');

class VarApi {
  get saveLocal() { return dataStore.vars.saveLocal; }
  set saveLocal(value) { dataStore.vars.saveLocal = !!value; }
  get searchLocal() { return dataStore.vars.searchLocal; }
  set searchLocal(value) { dataStore.vars.searchLocal = !!value; }
  setLocal(value) {
    this.saveLocal = value;
    this.searchLocal = value;
  }
  mod(name, value, options = {}) {
    options = _extend({}, {
      plus: false,
      minus: false,
      append: false,
      prepend: false,
      regexCut: false
    }, options);
    if((options.plus || options.minus) && _isNaN(parseFloat(value))) {
      throw new Error('When using --plus or --minus, <value> must be a number');
    }
    let val = dataStore.vars.get(name);
    let pattern = /^-?(\d+([.]\d+)?|[.]\d+)$/;
    let newVal = value;
    if(options.plus || options.minus) {
      if(pattern.test(val)) {
        newVal = String(parseFloat(val) + (value * (options.minus ? -1 : 1)));
      } else {
        throw new Error(`Variable ${name} is not numeric`);
      }
    } else if(options.append) {
      newVal = `${val}${value}`;
    } else if(options.prepend) {
      newVal = `${value}${val}`;
    } else if(options.regexCut) {
      newVal = val.replace(new RegExp(value, 'g'), '');
    }
    dataStore.vars.set(name, newVal);
    return { oldValue: val, newValue: newVal };
  }
  has(name) {
    return dataStore.vars.has(name);
  }
  get(name) {
    return dataStore.vars.get(name);
  }
  set(name, value) {
    return dataStore.vars.set(name, value);
  }
  delete(name) {
    return dataStore.vars.delete(name);
  }
  find(name, options = {}) {
    options = _extend({}, {
      local: false,
      global: false
    });
    let oldSearchLocal = this.searchLocal;
    try {
      this.searchLocal = options.local || !options.global;
      if(options.local && !options.global && !dataStore.vars.hasLocal(name)) {
        throw new Error(`${name} not found locally`);
      } else if(!options.local && options.global && !dataStore.vars.hasGlobal(name)) {
        throw new Error(`${name} not found globally`);
      } else if(((options.local && options.global) || (!options.local && !options.global)) && !dataStore.vars.has(name)) {
        throw new Error(`${name} not found`);
      } else if(this.has(name)) {
        return this.get(name);
      } else {
        throw new Error(`${name} not found`);
      }
    } finally {
      this.searchLocal = oldSearchLocal;
    }
  }
  search(pattern) {
    let vars = dataStore.vars.keys;
    let regex = _isRegExp(pattern) ? pattern : new RegExp('.*' + (pattern || '') + '.*');
    vars = _filter(vars, (v) => regex.test(v));
    vars = _sortBy(vars);
    return vars;
  }
  listSort(name) {
    let arr = dataStore.vars.get(name);
    if(_isArray(arr)) {
      dataStore.vars.set(name, orderBy(arr, [(v) => v.replace(/[_-]/g, ' '), (v) => v]));
      return true;
    }
    return false;
  }
  varSort() {
    dataStore.vars.sortVars();
  }
}

module.exports = {
  vars: new VarApi(),
  shell
};
