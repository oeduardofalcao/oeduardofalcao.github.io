export declare class GitHubAPIError extends Error {
    status: number;
    constructor(message: string, status: number);
}
export interface GitHubUser {
    login: string;
}
export interface GitHubRepo {
    id: number;
    full_name: string;
    default_branch: string;
}
export interface GitHubWebhook {
    config: {
        url?: string;
    };
}
export declare const requestGitHub: <T>(token: string, method: string, path: string, { query, body }?: {
    query?: Record<string, string | number>;
    body?: unknown;
}) => Promise<T>;
//# sourceMappingURL=github-api.d.ts.map