const path = require('path');
const os = require('os');
const fs = require('fs');
const { readJsonOrDefault, sortObjectByKeys } = require('./util');
const inquirer = require('inquirer');
const chalk = require('chalk');
const _uniq = require('lodash/uniq');
const _concat = require('lodash/concat');
const _keys = require('lodash/keys');
const _unset = require('lodash/unset');
const _isArray = require('lodash/isArray');

class VarList {
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

    /**
     * @param {string} varName
     * @param {boolean?} promptIfMissingRequired
     * @param {string?} defaultValue
     * @returns {string?}
     */
    async getVar(varName, promptIfMissingRequired = false, defaultValue = null) {
        let required = varName.charAt(0) == '#';
        if(required) {
            varName = varName.slice(1);
        }
        return this.getSystemVar(varName) ||
            this.getTempVar(varName) ||
            this.getRegVar(varName) ||
            this.getDefault(varName, defaultValue) ||
            await this.getRequiredPrompt(varName, required, promptIfMissingRequired) ||
            this.getRequired(varName, required) ||
            null;
    }

    getSystemVar(varName) {
        let match = null;
        if(!/^(PWD|WDNAME|((ROWS|COLS)((\-|\+)(\d+))?))$/.test(varName)) {
            return false;
        }
        if(varName == 'PWD') {
            return process.cwd();
        } else if(varName = 'WDNAME') {
            return path.basename(process.cwd());
        } else if((match = /^(ROWS|COLS)(?:(\+|\-)(\d+))?$/.exec(varName)) !== null) {
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

    async getRequiredPrompt(varName, required, promptIfMissingRequired) {
        if(!required || !promptIfMissingRequired) {
            return false;
        }
        let p = inquirer.createPromptModule();
        let { v } = await p({ name: 'v', message: `${varName} (press ENTER to cancel)` })
        if(!v || v == '') {
            process.exit(1);
        } else if(varName == '_') {
            return v;
        } else {
            this.tempVars[varName] = v;
            return this.getVar(`#${varName}`, true)
        }
    }

    getRequired(varName, required) {
        return required && `{{${varName}}}`;
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
        this._localVars = readJsonOrDefault(path.join(process.cwd(), 'vars.jse.json'), {});
    }

    saveLocalVars() {
        if(!this._noSave) {
            fs.writeFileSync(path.join(process.cwd(), 'vars.jse.json'), JSON.stringify(this._localVars, null, 2));
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
            console.log(chalk.red('_ is a reserved variable name'))
            process.exit(1);
        } else if(!/^[a-zA-Z0-9\-_]+$/.test(varName)) {
            console.log(chalk.red(`${varName} is not a valid variable name. Variable names can only contain letters, numbers, hyphens, and the underscore character.`));
            process.exit(1);
        } else if(varName.startsWith('_')) {
            console.log(chalk.red('Variables starting with an underscore are temporary variables only'));
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
        return this._localVars.hasOwnProperty(varName);
    }

    /**
     * @param {string} varName
     * @returns {boolean}
     */
    hasGlobal(varName) {
        return this._vars.hasOwnProperty(varName);
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

module.exports = { VarList };