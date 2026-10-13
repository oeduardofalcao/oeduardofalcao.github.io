import type { BaseOptionValues } from '../base-command.js';
export type LogsOptionValues = BaseOptionValues & {
    source?: string[];
    function?: string[];
    edgeFunction?: string[];
    since?: string;
    until?: string;
    follow?: boolean;
    url?: string;
    deployId?: string;
    level?: string[];
    json?: boolean;
};
//# sourceMappingURL=option_values.d.ts.map