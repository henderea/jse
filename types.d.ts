export declare interface ModOptions {
  plus?: boolean,
  minus?: boolean,
  append?: boolean,
  prepend?: boolean,
  regexCut?: boolean
}

export declare class VarApi {
  get saveLocal(): boolean;
  set saveLocal(value: boolean);
  get searchLocal(): boolean;
  set searchLocal(value: boolean);
  setLocal(value: boolean): void;
  mod(name: string, value: string, options?: ModOptions): { oldValue: string, newValue: string };
  has(name: string): boolean;
  get(name: string): string | string[] | undefined;
  set(name: string, value: string | string[]): boolean;
  delete(name: string): boolean;
  find(name: string, options?: { local?: boolean, global?: boolean }): string | string[];
  search(pattern: string | RegExp): string[];
  listSort(name: string): boolean;
  varSort(): void;
}

export declare class Escaped {
  constructor(value: string);
  toString(): string;
}

export declare interface Shell {
  escape(...params: string[]): Escaped;
  escapeList(...params: string[]): string[];
  preserve(...params: string[]): Escaped;
  protect(...params: string[]): Escaped;
  verbatim(...params: string[]): Escaped;
}

export declare class State {
  get wd(): string;
  get wdOverride(): string | null;
  set wdOverride(value: string | null);
  get hasOverride(): boolean;
  resetWd(): void;
}

export declare interface Jse {
  shell: Shell,
  vars: VarApi,
  version: string,
  state: State
}

declare const jse: Jse;

export default jse;