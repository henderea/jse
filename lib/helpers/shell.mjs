import fs from 'fs';
import path from 'path';

import { rootDir } from './util.mjs';

export const JSE_SHELL_REVISION = '2';
export const shellCode = fs.readFileSync(path.join(rootDir, 'resources/shell_code.sh'), 'utf8').replace(/!!JSE_SHELL_REVISION!!/g, JSE_SHELL_REVISION);
