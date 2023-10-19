import path from 'path';

import rawShellCode from '../../assets/shellCode.mjs';

const shellPath = process.env.SHELL || null;
const shellType = shellPath && path.basename(shellPath);
const shellSupported = ['sh', 'zsh', 'bash'].includes(shellType);
const initScripts = {
  zsh: '~/.zshrc',
  bash: '~/.bashrc'
};
const shellInitScript = initScripts[shellType] || null;
export const shellProgram = {
  path: shellPath,
  type: shellType,
  supported: shellSupported,
  initScript: shellInitScript
};
export const JSE_SHELL_REVISION = '2';
export const shellCode = rawShellCode.replace(/!!JSE_SHELL_REVISION!!/g, JSE_SHELL_REVISION);
