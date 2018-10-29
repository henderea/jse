const path = require('path');

const script = process.pkg ? process.argv[0] : process.argv[1];
const paths = {}
paths.root = path.join(__dirname, '../../');
paths.resource = path.join(paths.root, 'resources');
const absPath = (p) => path.join(paths.root, p);
const resourcePath = (p) => path.join(paths.resource, p);
const version = require('../../package.json').version;

module.exports = { script, paths, absPath, resourcePath, version };