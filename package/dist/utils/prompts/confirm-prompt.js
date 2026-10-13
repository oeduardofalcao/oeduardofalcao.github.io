import { confirm } from '@inquirer/prompts';
import { log, exit } from '../command-helpers.js';
export const confirmPrompt = async (message) => {
    const confirmed = await confirm({ message, default: false });
    log();
    if (!confirmed) {
        exit();
    }
};
//# sourceMappingURL=confirm-prompt.js.map