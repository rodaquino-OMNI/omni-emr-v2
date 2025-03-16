
import { FunctionBlock } from '../../types/functionBlocks';

/**
 * Check for circular dependencies in function blocks
 */
export const checkForCircularDependencies = (
  functionBlocks: FunctionBlock[],
  blockId: string,
  visited: Set<string> = new Set(),
  recursionStack: Set<string> = new Set()
): boolean => {
  // Mark the current node as visited and part of recursion stack
  visited.add(blockId);
  recursionStack.add(blockId);
  
  // Get the current block
  const block = functionBlocks.find(b => b.id === blockId);
  
  // If block has dependencies, check each one
  if (block?.requiredDependencies) {
    for (const depId of block.requiredDependencies) {
      // If not visited, check for circular dependency
      if (!visited.has(depId)) {
        if (checkForCircularDependencies(functionBlocks, depId, visited, recursionStack)) {
          return true;
        }
      } 
      // If already in recursion stack, we found a cycle
      else if (recursionStack.has(depId)) {
        return true;
      }
    }
  }
  
  // Remove from recursion stack
  recursionStack.delete(blockId);
  return false;
};

/**
 * Get all dependent function blocks that need to be enabled
 * when enabling a specific function block
 */
export const getDependentFunctionBlocks = (
  functionBlocks: FunctionBlock[],
  blockId: string
): string[] => {
  const dependencies: string[] = [];
  const block = functionBlocks.find(b => b.id === blockId);
  
  if (!block?.requiredDependencies) return dependencies;
  
  // Add direct dependencies
  dependencies.push(...block.requiredDependencies);
  
  // Add indirect dependencies (dependencies of dependencies)
  for (const depId of block.requiredDependencies) {
    dependencies.push(...getDependentFunctionBlocks(functionBlocks, depId));
  }
  
  // Return unique dependencies
  return [...new Set(dependencies)];
};
