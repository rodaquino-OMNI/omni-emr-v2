# Git Troubleshooting Guide

## Reference Inconsistency Errors

### Symptoms
- Error message: `fatal: cannot lock ref 'HEAD': is at [commit-hash] but expected [different-commit-hash]`
- Unable to commit changes despite having a clean working tree
- Git operations that modify references fail

### Causes
1. **Git Reference State Inconsistency**: Git's internal tracking of HEAD becomes out of sync
2. **Corrupted Git Repository**: Inconsistent internal references
3. **Interrupted Git Operations**: Incomplete branch switching or other operations
4. **Concurrent Git Processes**: Multiple processes causing lock contention

### Solutions
1. **Run Git Garbage Collection**:
   ```
   git gc
   ```
   This cleans up and repacks Git objects and references, often resolving inconsistencies.

2. **Check for Lock Files**:
   ```
   find .git -name "*.lock"
   ```
   If you find lock files and no Git processes are running, you may need to manually remove them.

3. **Verify References**:
   ```
   git fsck
   ```
   This checks the integrity of the Git database and can identify corrupted objects.

### Prevention
1. Avoid interrupting Git operations (especially during commits or merges)
2. Regularly run `git gc` to maintain repository health
3. Consider using `git config --global gc.auto 1` to enable automatic garbage collection
4. Ensure proper Git client and server configurations in team environments
