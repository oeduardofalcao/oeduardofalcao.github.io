export const createGitCredentialCommand = (program) => program
    .command('git-credential', { hidden: true })
    .description('Git credential helper for Netlify authentication (used internally by git)')
    .argument('<operation>', 'Git credential operation (get, store, erase)')
    .action(async (operation, options) => {
    const { gitCredential } = await import('./git-credential.js');
    await gitCredential(operation, options);
});
//# sourceMappingURL=index.js.map