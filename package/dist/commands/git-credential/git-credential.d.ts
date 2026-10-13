import type { Readable, Writable } from 'stream';
import type { GitCredentialOptionValues } from './option_values.js';
export declare const NETLIFY_GIT_HOST = "git.netlify.com";
export declare const parseGitCredentialInput: (input: Readable) => Promise<Partial<Record<string, string>>>;
export declare const writeCredentials: (output: Writable, token: string) => void;
export declare const gitCredential: (operation: string, _options: GitCredentialOptionValues) => Promise<void>;
//# sourceMappingURL=git-credential.d.ts.map