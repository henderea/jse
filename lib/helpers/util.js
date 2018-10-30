const path = require('path');

const _range = require('lodash/range');
const _repeat = require('lodash/repeat');
const _pad = require('lodash/pad');

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
const paths = {}
paths.root = path.join(__dirname, '../../');
paths.resource = path.join(paths.root, 'resources');
const absPath = (p) => path.join(paths.root, p);
const resourcePath = (p) => path.join(paths.resource, p);
const version = require('../../package.json').version;

class Range {
    constructor(start, end) {
        this._start = start;
        this._end = end;
    }

    get start() {
        return this._start;
    }

    set start(val) {
        this._start = val;
    }

    get end() {
        return this._end;
    }

    set end(val) {
        this._end = val;
    }

    get size() {
        return this.end - this.start;
    }

    get range() {
        return _range(this.start, this.end);
    }

    offset(i) {
        return i - this.start;
    }
}

const _r = (start, end) => new Range(start, end);

module.exports = { script, paths, absPath, resourcePath, version, _r, Range };