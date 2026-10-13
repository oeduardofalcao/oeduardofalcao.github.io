export declare const CANONICAL_AGENT_NAMES: readonly ['claude', 'codex', 'copilot', 'gemini', 'cursor', 'opencode', 'kiro', 'cline', 'amp', 'warp', 'claudeai', 'chatgpt', 'other'];
export type CanonicalAgentName = (typeof CANONICAL_AGENT_NAMES)[number];
export type DrivingAgent = {
    name: CanonicalAgentName;
    source: string;
    version?: string;
    markers?: CanonicalAgentName[];
    otherValue?: string;
};
export declare const getDrivingAgent: (env?: NodeJS.ProcessEnv) => DrivingAgent | undefined;
//# sourceMappingURL=agent-detection.d.ts.map