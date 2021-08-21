import fs from 'fs';
import path from 'path';

import _map from 'lodash/map.js';
import _each from 'lodash/each.js';
import _times from 'lodash/times.js';

import { script, version, _r, rootDir } from './util.mjs';

let lines = fs.readFileSync(path.join(rootDir, 'resources/about-template.txt'), 'utf8').lines;

const chars = {
  '.': [
    ' ',
    ' ',
    '.'
  ],
  '0': [
    ' _ ',
    '| |',
    '|_|'
  ],
  '1': [
    '   ',
    ' | ',
    ' | '
  ],
  '2': [
    ' _ ',
    ' _|',
    '|_ '
  ],
  '3': [
    ' _ ',
    ' _|',
    ' _|'
  ],
  '4': [
    '   ',
    '|_|',
    '  |'
  ],
  '5': [
    ' _ ',
    '|_ ',
    ' _|'
  ],
  '6': [
    ' _ ',
    '|_ ',
    '|_|'
  ],
  '7': [
    ' __',
    '  /',
    ' / '
  ],
  '8': [
    ' _ ',
    '|_|',
    '|_|'
  ],
  '9': [
    ' _ ',
    '|_|',
    ' _|'
  ]
};

let vNumLines = [[], [], []];
let vNum = version.replace(/[^.0-9]/g, '');

_each(vNum, (c) => {
  let d = chars[c+''];
  _times(3, (j) => {
    vNumLines[j].push(d[j]);
  });
});

vNumLines = _map(vNumLines, (l) => l.join(' '));

const xRange = _r(5,35);
const yRange = _r(8,11);

const xRangeSize = xRange.size;

vNumLines = _map(vNumLines, (l) => l.pad(xRangeSize));

_each(yRange.range, (i) => {
  let j = yRange.offset(i);
  let l = lines[i];
  lines[i] = l.insert(vNumLines[j], xRange);
});

export const aboutText = `
${lines.join('\n')}


Installed at ${script}

`;
