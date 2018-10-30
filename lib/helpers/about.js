const fs = require('fs');
const { script, resourcePath, version, _r } = require('./util.js');
const map = require('lodash/map');
const each = require('lodash/each');
const times = require('lodash/times');
const floor = require('lodash/floor');
const repeat = require('lodash/repeat');

let lines = fs.readFileSync(resourcePath('about-template.txt'), 'UTF-8').lines;

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

each(vNum, (c) => {
    let d = chars[c+''];
    times(3, j => {
        vNumLines[j].push(d[j]);
    });
});

vNumLines = map(vNumLines, l => l.join(' '));

const xRange = _r(5,35);
const yRange = _r(8,11);

const xRangeSize = xRange.size;

vNumLines = map(vNumLines, l => l.pad(xRangeSize));

each(yRange.range, i => {
    let j = yRange.offset(i);
    let l = lines[i];
    lines[i] = l.insert(vNumLines[j], xRange);
});

const aboutText = `
${lines.join('\n')}


Installed at ${script}

`;

module.exports = { aboutText };