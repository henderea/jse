const fs = require('fs');
const path = require('path');
const { script, version, _r, rootDir } = require('./util.js');
const _map = require('lodash/map');
const _each = require('lodash/each');
const _times = require('lodash/times');

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
    _times(3, j => {
        vNumLines[j].push(d[j]);
    });
});

vNumLines = _map(vNumLines, l => l.join(' '));

const xRange = _r(5,35);
const yRange = _r(8,11);

const xRangeSize = xRange.size;

vNumLines = _map(vNumLines, l => l.pad(xRangeSize));

_each(yRange.range, i => {
    let j = yRange.offset(i);
    let l = lines[i];
    lines[i] = l.insert(vNumLines[j], xRange);
});

const aboutText = `
${lines.join('\n')}


Installed at ${script}

`;

module.exports = { aboutText };