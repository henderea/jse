import path from 'path';

function isBlank(str) {
  return !str || String(str).trim() == '';
}

class State {
  constructor() {
    this._wdOverride = null;
  }

  get wd() { return this.wdOverride || process.cwd(); }
  get wdOverride() { return this._wdOverride; }
  set wdOverride(value) { this._wdOverride = isBlank(value) ? null : path.resolve(value); }
  get hasOverride() { return !isBlank(this.wdOverride); }
  resetWd() { this.wdOverride = null; }
}

export const state = new State();
