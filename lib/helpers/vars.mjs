import path from 'path';
import os from 'os';
import fs from 'fs';

import { styles } from '@henderea/simple-colors';
const { red } = styles;

import _uniq from 'lodash/uniq.js';
import _concat from 'lodash/concat.js';
import _keys from 'lodash/keys.js';
import _unset from 'lodash/unset.js';
import _isArray from 'lodash/isArray.js';

import { readJsonOrDefault, sortObjectByKeys } from './util.mjs';
import { state } from './state.mjs';

export class VarList {
  constructor() {
    this._saveLocal = false;
    this._localVars = {};
    this._vars = {};
    this._searchLocal = true;
    this._tempStack = [];
    this._tempVars = {};
    this._noSave = false;
    this.loadVars();
    this.loadLocalVars();
  }

  pushTemp() {
    this._tempStack.push(self._tempVars.slice());
  }

  popTemp() {
    let tmp = this._tempStack.pop();
    if(tmp) {
      this._tempVars = tmp;
    }
  }

  /**
     * @returns {{[string]: string}}
     */
  get tempVars() {
    return this._tempVars;
  }

  getSystemVar(varName) {
    let match = null;
    if(!/^(PWD|WDNAME|((ROWS|COLS)(([+-])(\d+))?))$/.test(varName)) {
      return false;
    }
    if(varName == 'PWD') {
      return state.wd;
    } else if(varName == 'WDNAME') {
      return path.basename(state.wd);
    } else if((match = /^(ROWS|COLS)(?:([+-])(\d+))?$/.exec(varName)) !== null) {
      let s = match[1] == 'ROWS' ? process.stdout.rows : process.stdout.columns;
      if(match[2] && match[3]) {
        s += (match[2] == '+' ? 1 : -1) * parseInt(match[3]);
      }
      return `${s}`;
    } else {
      return null;
    }
  }

  getTempVar(varName) {
    return varName != '_' && this.tempVars[varName];
  }

  getRegVar(varName) {
    if(varName == '_' || varName.startsWith('_')) {
      return false;
    }
    let v = this.get(varName);
    return _isArray(v) ? v.join(' ') : v;
  }

  getDefault(varName, defaultValue) {
    if(!defaultValue) {
      return false;
    }
    this.tempVars[varName] = defaultValue;
    return defaultValue;
  }

  /**
     * @returns {boolean}
     */
  get saveLocal() {
    return this._saveLocal;
  }

  /**
     * @param {boolean} value
     */
  set saveLocal(value) {
    this._saveLocal = value;
  }

  /**
     * @returns {boolean}
     */
  get searchLocal() {
    return this._searchLocal;
  }

  /**
     * @param {boolean} value
     */
  set searchLocal(value) {
    this._searchLocal = value;
  }

  sortVars() {
    if(this.saveLocal) {
      this._localVars = sortObjectByKeys(this._localVars);
      this.saveLocalVars();
    } else {
      this._vars = sortObjectByKeys(this._vars);
      this.saveVars();
    }
  }

  /**
     * @param {() => mixed} func
     */
  noSave(func) {
    this._noSave = true;
    func();
    this._noSave = false;
  }

  loadLocalVars() {
    this._localVars = readJsonOrDefault(path.join(state.wd, 'vars.jse.json'), {});
  }

  saveLocalVars() {
    if(!this._noSave) {
      fs.writeFileSync(path.join(state.wd, 'vars.jse.json'), JSON.stringify(this._localVars, null, 2));
    }
  }

  loadVars() {
    this._vars = readJsonOrDefault(path.join(os.homedir(), 'vars.jse.json'), {});
  }

  saveVars() {
    if(!this._noSave) {
      fs.writeFileSync(path.join(os.homedir(), 'vars.jse.json'), JSON.stringify(this._vars, null, 2));
    }
  }

  /**
     * @param {string} varName
     * @returns {string}
     */
  get(varName) {
    return (this.hasLocal(varName) && this._searchLocal) ? this._localVars[varName] : this._vars[varName];
  }

  /**
     * @param {string} varName
     * @param {string} value
     * @returns {boolean}
     */
  set(varName, value) {
    if(varName == '_') {
      console.log(red('_ is a reserved variable name'));
      process.exit(1);
    } else if(!/^[a-zA-Z0-9\-_]+$/.test(varName)) {
      console.log(red(`${varName} is not a valid variable name. Variable names can only contain letters, numbers, hyphens, and the underscore character.`));
      process.exit(1);
    } else if(varName.startsWith('_')) {
      console.log(red('Variables starting with an underscore are temporary variables only'));
      process.exit(1);
    } else if(this.saveLocal) {
      let rv = this.hasLocal(varName);
      this._localVars[varName] = value;
      this.saveLocalVars();
      return rv;
    } else {
      let rv = this.hasGlobal(varName);
      this._vars[varName] = value;
      this.saveVars();
      return rv;
    }
  }

  /**
     * @param {string} varName
     * @returns {boolean}
     */
  hasLocal(varName) {
    return Object.prototype.hasOwnProperty.call(this._localVars, varName);
  }

  /**
     * @param {string} varName
     * @returns {boolean}
     */
  hasGlobal(varName) {
    return Object.prototype.hasOwnProperty.call(this._vars, varName);
  }

  /**
     * @param {string} varName
     * @returns {boolean}
     */
  has(varName) {
    return this.hasLocal(varName) || this.hasGlobal(varName);
  }

  /**
     * @returns {string[]}
     */
  get keys() {
    return _uniq(_concat([], _keys(this._localVars), _keys(this._vars)));
  }

  /**
     * @param {string} varName
     * @returns {boolean}
     */
  delete(varName) {
    if(this.saveLocal) {
      let rv = this.hasLocal(varName);
      _unset(this._localVars, varName);
      this.saveLocalVars();
      return rv;
    } else {
      let rv = this.hasGlobal(varName);
      _unset(this._vars, varName);
      this.saveVars();
      return rv;
    }
  }
}
