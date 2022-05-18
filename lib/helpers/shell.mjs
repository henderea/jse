import fs from 'fs';
import path from 'path';

import { rootDir } from './util.mjs';

export const shellCode = fs.readFileSync(path.join(rootDir, 'resources/shell_code.sh'), 'utf8');
