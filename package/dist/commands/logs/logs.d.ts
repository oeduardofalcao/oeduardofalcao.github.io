import type { NetlifyAPI } from '@netlify/api';
import type BaseCommand from '../base-command.js';
import type { LogsOptionValues } from './option_values.js';
type Source = 'functions' | 'edge-functions' | 'deploy';
export declare const logsCommand: (options: LogsOptionValues, command: BaseCommand) => Promise<undefined>;
export declare const runFollowMode: ({ sources, client, siteId, accessToken, deployId, deployTargeted, functionNames, edgeFunctionNames, levelsToPrint, json, }: {
    sources: Source[];
    client: NetlifyAPI;
    siteId: string;
    accessToken: string | null | undefined;
    deployId?: string;
    deployTargeted: boolean;
    functionNames: string[];
    edgeFunctionNames: string[];
    levelsToPrint: string[];
    json: boolean;
}) => Promise<undefined>;
export {};
//# sourceMappingURL=logs.d.ts.map