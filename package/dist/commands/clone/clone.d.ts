import type BaseCommand from '../base-command.js';
import type { CloneOptionValues } from './option_values.js';
export declare const getCredentialHelper: () => string;
export declare const finalizeClone: (options: CloneOptionValues, command: BaseCommand, workingDir: string, linkOverrides: {
    id?: string;
    name?: string;
    gitRemoteUrl?: string;
}) => Promise<void>;
export declare const clone: (options: CloneOptionValues, command: BaseCommand, args: {
    repo: string;
    targetDir?: string;
}) => Promise<void>;
//# sourceMappingURL=clone.d.ts.map