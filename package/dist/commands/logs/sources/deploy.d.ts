import type { NetlifyAPI } from '@netlify/api';
import type { LogEntry } from '../log-api.js';
export declare const fetchDeployHistoricalLogs: ({ siteId, accessToken, deployId, from, to, }: {
    siteId: string;
    accessToken: string | null | undefined;
    deployId: string;
    from: number;
    to: number;
}) => Promise<LogEntry[]>;
export declare const streamDeploy: (siteId: string, deployId: string, accessToken: string | null | undefined, onEntry: (entry: LogEntry) => void, onClose: () => void, { closeWhenIdleMs }?: {
    closeWhenIdleMs?: number;
}) => (() => void);
export declare const findCurrentBuildingDeploy: (client: NetlifyAPI, siteId: string) => Promise<string | undefined>;
export declare const findLatestReadyDeploy: (client: NetlifyAPI, siteId: string) => Promise<string | undefined>;
export declare const findLatestFinishedDeploy: (client: NetlifyAPI, siteId: string) => Promise<string | undefined>;
export declare const isDeployFinished: (client: NetlifyAPI, siteId: string, deployId: string) => Promise<boolean>;
//# sourceMappingURL=deploy.d.ts.map