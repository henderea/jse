const fs = require('fs');
const { script, resourcePath, version } = require('./util.js');
const map = require('lodash/map');
const each = require('lodash/each');
const times = require('lodash/times');
const floor = require('lodash/floor');
const repeat = require('lodash/repeat');
const range = require('lodash/range');

let lines = fs.readFileSync(resourcePath('about-template.txt'), 'UTF-8').split(/[\r\n]/g);

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
}

let vNumLines = [[], [], []];
let vNum = version.replace(/[^.0-9]/g, '');

each(vNum, (c) => {
    let d = chars[c+''];
    times(3, j => {
        vNumLines[j].push(d[j]);
    });
});

vNumLines = map(vNumLines, l => l.join(' '));

let len = vNumLines[0].length;

const xRange = [5,35];
const yRange = [8,11];

const xRangeSize = xRange[1] - xRange[0];
const paddingStart = floor((xRangeSize - len) / 2);
const paddingEnd = xRangeSize - len - paddingStart;

vNumLines = map(vNumLines, l => `${repeat(' ', paddingStart)}${l}${repeat(' ', paddingEnd)}`);

each(range(...yRange), i => {
    let j = i - yRange[0];
    let l = lines[i];
    lines[i] = `${l.slice(0, xRange[0])}${vNumLines[j]}${l.slice(xRange[1])}`;
})

const aboutText = `
${lines.join('\n')}

Installed at ${script}

`;

module.exports = { aboutText };