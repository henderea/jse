import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { orderBy } from 'natural-orderby';
import escalade from 'escalade/sync';

import _range from 'lodash/range.js';
import _repeat from 'lodash/repeat.js';
import _pad from 'lodash/pad.js';
import _toPairs from 'lodash/toPairs.js';
import _fromPairs from 'lodash/fromPairs.js';

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
    return `${this.slice(0, start)}${str}${this.slice(end)}`;
  };
}

if(!String.prototype.padBoth) {
  String.prototype.padBoth = function(before, after, char) {
    if(!char) {
      char = ' ';
    }
    return `${_repeat(char, before)}${this}${_repeat(char, after)}`;
  };
}

if(!String.prototype.pad) {
  String.prototype.pad = function(len, char) {
    if(!char) {
      char = ' ';
    }
    return _pad(this, len, char);
  };
}

export const script = process.pkg ? process.argv[0] : process.argv[1];
let dir;
try {
  dir = path.dirname(fileURLToPath(import.meta.url));
} catch {
  //empty
}
try {
  dir = eval('__dirname');
} catch {
  //empty
}
export const rootDir = escalade(dir, (dir, names) => names.includes('package.json') && '.');
export const version = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8')).version;

export class Range {
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
export const _r = (start, end) => new Range(start, end);

/**
 * @param {string} fileName
 * @param {{[string]: any}|any[]} defaultValue
 * @returns {{[string]: any}|any[]}
 */
export const readJsonOrDefault = (fileName, defaultValue) => {
  try {
    if(fs.existsSync(fileName)) {
      let data = fs.readFileSync(fileName, 'utf8');
      return JSON.parse(data);
    }
  } catch {
    // do nothing
  }
  return defaultValue;
};

export const sortObjectByKeys = (obj) => {
  return _fromPairs(orderBy(_toPairs(obj), [(v) => v[0].replace(/[_-]/g, ' '), (v) => v[0]]));
};
