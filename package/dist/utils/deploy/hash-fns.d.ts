import BaseCommand from '../../commands/base-command.js';
import { $TSFixMe } from '../../commands/types.js';
import type { ServerUploadFile } from './upload-files.js';
declare const hashFns: (command: BaseCommand, directories: string[], { concurrentHash, functionsConfig, hashAlgorithm, manifestPath, packagePath, rootDir, serverEnabled, serverManifestPath, skipFunctionsCache, statusCb, tmpDir, }: {
    concurrentHash?: number;
    functionsConfig?: $TSFixMe;
    hashAlgorithm?: string | undefined;
    manifestPath?: string | undefined;
    packagePath?: string | undefined;
    rootDir?: string | undefined;
    serverEnabled?: boolean | undefined;
    serverManifestPath?: string | undefined;
    skipFunctionsCache?: boolean | undefined;
    statusCb: $TSFixMe;
    tmpDir: $TSFixMe;
}) => Promise<{
    functionSchedules?: {
        name: string;
        cron: string;
    }[] | undefined;
    functions: Record<string, string>;
    functionsWithNativeModules: $TSFixMe[];
    shaMap?: Record<string, $TSFixMe> | undefined;
    fnShaMap?: Record<string, $TSFixMe[]> | undefined;
    fnConfig?: Record<string, $TSFixMe> | undefined;
    server?: {
        sha: string;
        region?: string;
    } | undefined;
    serverShaMap?: Record<string, ServerUploadFile[]> | undefined;
}>;
export default hashFns;
//# sourceMappingURL=hash-fns.d.ts.map