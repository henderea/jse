const path = require('path');
const fs = require('fs');

const _range = require('lodash/range');
const _repeat = require('lodash/repeat');
const _pad = require('lodash/pad');
const _toPairs = require('lodash/toPairs');
const _fromPairs = require('lodash/fromPairs');
const { orderBy } = require('natural-orderby')

if(!String.prototype.lines) {
    Object.defineProperty(String.prototype, 'lines', {
        get() {
            return this.split(/\r*\n+/g);
        }
    });
}

if(!String.prototype.insert) {
    String.prototype.insert = function(str, start, end) {
        if(!end && start instanceof Range) {
            end = start.end;
            start = start.start;
        }
        return `${this.slice(0, start)}${str}${this.slice(end)}`
    }
}

if(!String.prototype.padBoth) {
    String.prototype.padBoth = function(before, after, char) {
        if(!char) {
            char = ' ';
        }
        return `${_repeat(char, before)}${this}${_repeat(char, after)}`;
    }
}

if(!String.prototype.pad) {
    String.prototype.pad = function(len, char) {
        if(!char) {
            char = ' ';
        }
        return _pad(this, len, char);
    }
}

const script = process.pkg ? process.argv[0] : process.argv[1];
const dir = eval('__dirname');
let rootDir = path.join(dir, '..');
if(path.basename(dir) == 'helpers') {
    rootDir = path.join(dir, '../..');
}
const version = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8')).version;

class Range {
    /**
     * @param {number} start
     * @param {number} end
     */
    constructor(start, end) {
        this._start = start;
        this._end = end;
    }

    /**
     * @returns {number}
     */
    get start() {
        return this._start;
    }

    /**
     * @param {number} val
     */
    set start(val) {
        this._start = val;
    }

    /**
     * @returns {number}
     */
    get end() {
        return this._end;
    }

    /**
     * @param {number} val
     */
    set end(val) {
        this._end = val;
    }

    /**
     * @returns {number}
     */
    get size() {
        return this.end - this.start;
    }

    /**
     * @returns {number[]}
     */
    get range() {
        return _range(this.start, this.end);
    }

    /**
     * @param {number} i
     * @returns {number}
     */
    offset(i) {
        return i - this.start;
    }
}

/**
 * @param {number} start
 * @param {number} end
 * @returns {Range}
 */
const _r = (start, end) => new Range(start, end);

/**
 * @param {string} fileName
 * @param {{[string]: any}|any[]} defaultValue
 * @returns {{[string]: any}|any[]}
 */
const readJsonOrDefault = (fileName, defaultValue) => {
    try {
        if(fs.existsSync(fileName)) {
            let data = fs.readFileSync(fileName, 'utf8');
            return JSON.parse(data);
        }
    } catch(e) { }
    return defaultValue;
}

const sortObjectByKeys = (obj) => {
    return _fromPairs(orderBy(_toPairs(obj), [v => v[0].replace(/[_-]/g, ' '), v => v[0]]));
}

module.exports = { script, version, _r, Range, readJsonOrDefault, sortObjectByKeys, rootDir };