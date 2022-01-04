import path from 'path';
import fs from 'fs';

function isBlank(str) {
  return !str || String(str).trim() == '';
}

function ifExists(value) {
  if(isBlank(value)) { return null; }
  value = path.resolve(value);
  if(!fs.existsSync(value)) { return null; }
  return value;
}

class State {
  constructor() {
    this._wdOverride = null;
  }

  get wd() { return this.wdOverride || process.cwd(); }
  get wdOverride() { return this._wdOverride; }
  set wdOverride(value) { this._wdOverride = ifExists(value); }
  get hasOverride() { return !isBlank(this.wdOverride); }
  resetWd() { this.wdOverride = null; }
}

export const state = new State();
