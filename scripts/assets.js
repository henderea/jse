const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const assetsDir = path.join(rootDir, 'assets');
const resourcesDir = path.join(rootDir, 'resources');

if(!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

function saveAsset(fileName, varName, value) {
  fs.writeFileSync(path.join(assetsDir, fileName), `const ${varName} = ${JSON.stringify(value)};\nexport default ${varName};\n`);
}

const version = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8')).version;

saveAsset('version.mjs', 'version', version);

const aboutTemplate = fs.readFileSync(path.join(resourcesDir, 'about-template.txt'), 'utf8');

saveAsset('aboutTemplate.mjs', 'aboutTemplate', aboutTemplate);

const shellCode = fs.readFileSync(path.join(resourcesDir, 'shell_code.sh'), 'utf8');

saveAsset('shellCode.mjs', 'shellCode', shellCode);
