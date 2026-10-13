import { getWebSocket } from '../../../utils/websockets/index.js';
const DEPLOY_LOG_REPLAY_TIMEOUT_MS = 30_000;
const DEPLOY_STREAM_START_TIMEOUT_MS = 20_000;
const parseDeployLogTimestamp = (message) => {
    if (!message.ts) {
        return undefined;
    }
    const ts = new Date(message.ts).getTime();
    return Number.isNaN(ts) ? undefined : ts;
};
const toLogEntry = (message, ts) => ({
    source: 'deploy',
    name: 'deploy',
    ts,
    level: message.level ?? 'INFO',
    message: message.log ?? message.message ?? '',
    section: message.section,
});
const isEndOfBuild = (message) => message.type === 'report' && message.section === 'building';
const parseDeployLogMessage = (data) => {
    let parsed;
    try {
        parsed = JSON.parse(data);
    }
    catch {
        return null;
    }
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? parsed : null;
};
export const fetchDeployHistoricalLogs = async ({ siteId, accessToken, deployId, from, to, }) => {
    const collected = [];
    const ws = getWebSocket('wss://socketeer.services.netlify.com/build/logs');
    await new Promise((resolve, reject) => {
        let settled = false;
        const finish = (error) => {
            if (settled) {
                return;
            }
            settled = true;
            clearTimeout(timeout);
            ws.close();
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        };
        const timeout = setTimeout(() => {
            finish();
        }, DEPLOY_LOG_REPLAY_TIMEOUT_MS);
        ws.on('open', () => {
            ws.send(JSON.stringify({
                deploy_id: deployId,
                site_id: siteId,
                access_token: accessToken,
            }));
        });
        ws.on('message', (data) => {
            const message = parseDeployLogMessage(data);
            if (!message) {
                return;
            }
            if (isEndOfBuild(message)) {
                finish();
                return;
            }
            const parsedTs = parseDeployLogTimestamp(message);
            collected.push({
                entry: toLogEntry(message, parsedTs ?? Date.now()),
                hasTimestamp: parsedTs !== undefined,
            });
        });
        ws.on('close', () => {
            finish();
        });
        ws.on('error', (error) => {
            finish(error);
        });
    });
    return collected
        .filter(({ entry, hasTimestamp }) => !hasTimestamp || (entry.ts >= from && entry.ts <= to))
        .map(({ entry }) => entry)
        .sort((a, b) => a.ts - b.ts);
};
export const streamDeploy = (siteId, deployId, accessToken, onEntry, onClose, { closeWhenIdleMs } = {}) => {
    const ws = getWebSocket('wss://socketeer.services.netlify.com/build/logs');
    let closeTimer;
    const scheduleClose = (ms) => {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
            ws.close();
        }, ms);
    };
    ws.on('error', () => {
        clearTimeout(closeTimer);
    });
    if (closeWhenIdleMs !== undefined) {
        scheduleClose(DEPLOY_STREAM_START_TIMEOUT_MS);
    }
    ws.on('open', () => {
        ws.send(JSON.stringify({
            deploy_id: deployId,
            site_id: siteId,
            access_token: accessToken,
        }));
    });
    ws.on('message', (data) => {
        const message = parseDeployLogMessage(data);
        if (!message) {
            return;
        }
        onEntry(toLogEntry(message, parseDeployLogTimestamp(message) ?? Date.now()));
        if (closeWhenIdleMs !== undefined) {
            scheduleClose(closeWhenIdleMs);
        }
        if (isEndOfBuild(message)) {
            ws.close();
        }
    });
    ws.on('close', () => {
        clearTimeout(closeTimer);
        onClose();
    });
    return () => {
        clearTimeout(closeTimer);
        ws.close();
    };
};
export const findCurrentBuildingDeploy = async (client, siteId) => {
    const deploys = (await client.listSiteDeploys({ siteId, state: 'building' }));
    return deploys.length > 0 ? deploys[0].id : undefined;
};
export const findLatestReadyDeploy = async (client, siteId) => {
    const deploys = (await client.listSiteDeploys({ siteId, state: 'ready', per_page: 1 }));
    return deploys.length > 0 ? deploys[0].id : undefined;
};
const FINISHED_DEPLOY_STATES = new Set(['ready', 'error', 'cancelled']);
export const findLatestFinishedDeploy = async (client, siteId) => {
    const deploys = (await client.listSiteDeploys({ siteId, per_page: 10 }));
    const finished = deploys.find((deploy) => FINISHED_DEPLOY_STATES.has(deploy.state));
    return finished?.id;
};
export const isDeployFinished = async (client, siteId, deployId) => {
    const deploy = (await client.getSiteDeploy({ siteId, deployId }));
    return typeof deploy.state === 'string' && FINISHED_DEPLOY_STATES.has(deploy.state);
};
//# sourceMappingURL=deploy.js.map