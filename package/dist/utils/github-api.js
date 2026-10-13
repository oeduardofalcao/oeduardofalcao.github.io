const GITHUB_API_URL = 'https://api.github.com';
export class GitHubAPIError extends Error {
    status;
    constructor(message, status) {
        super(message);
        // Keeps error output identical to what Octokit printed before it was replaced.
        this.name = 'HttpError';
        this.status = status;
    }
}
// Mirrors Octokit's message format, which callers rely on to detect specific validation errors.
const readErrorMessage = async (response) => {
    const text = await response.text();
    let body;
    try {
        body = JSON.parse(text);
    }
    catch {
        return text || response.statusText;
    }
    const message = body.message ?? response.statusText;
    const details = body.errors?.length ? `: ${body.errors.map((error) => JSON.stringify(error)).join(', ')}` : '';
    const suffix = body.documentation_url ? ` - ${body.documentation_url}` : '';
    return `${message}${details}${suffix}`;
};
export const requestGitHub = async (token, method, path, { query, body } = {}) => {
    const url = new URL(path, GITHUB_API_URL);
    for (const [key, value] of Object.entries(query ?? {})) {
        url.searchParams.set(key, String(value));
    }
    const response = await fetch(url, {
        method,
        headers: {
            Accept: 'application/vnd.github.v3+json',
            Authorization: `token ${token}`,
            'User-Agent': 'netlify-cli',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json; charset=utf-8' }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!response.ok) {
        throw new GitHubAPIError(await readErrorMessage(response), response.status);
    }
    const text = await response.text();
    return (text ? JSON.parse(text) : undefined);
};
//# sourceMappingURL=github-api.js.map