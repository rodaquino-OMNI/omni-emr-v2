/**
 * Validation utilities for the Orphaned Pages Manager
 * Includes functions for validating configuration files and detecting duplicates
 */

/**
 * Validate route configuration format
 * @param {string} content - Route configuration content
 * @returns {boolean} - Whether the format is valid
 */
export function validateRouteConfig(content) {
  // Check for basic syntax errors
  try {
    // Check for unbalanced braces
    let braceCount = 0;
    for (const char of content) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      if (braceCount < 0) throw new Error('Unbalanced braces: too many closing braces');
    }
    if (braceCount !== 0) throw new Error('Unbalanced braces: missing closing braces');
    
    // Check for missing commas between objects
    const objectRegex = /}\s*{/g;
    if (objectRegex.test(content)) {
      throw new Error('Missing commas between objects');
    }
    
    // Check for invalid route definitions
    const routeRegex = /{\s*path:[^}]*}/g;
    const routes = content.match(routeRegex) || [];
    
    for (const route of routes) {
      if (!route.includes('component:')) {
        throw new Error('Route missing component property');
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Invalid route configuration: ${error.message}`);
    return false;
  }
}

/**
 * Generate a hash for a route
 * @param {string} path - Route path
 * @param {string} component - Route component
 * @returns {string} - Hash
 */
export function generateRouteHash(path, component) {
  // Create a unique hash for the route based on path and component
  return `${path}|${component}`.toLowerCase();
}

/**
 * Build a hash map of existing routes
 * @param {string} content - Route configuration content
 * @returns {Object} - Hash map
 */
export function buildRouteHashMap(content) {
  // Extract all existing routes and build a hash map for O(1) lookups
  const routeRegex = /{\s*path:\s*['"]([^'"]+)['"]\s*,\s*component:\s*['"]([^'"]+)['"]/g;
  const routes = {};
  let match;
  
  while ((match = routeRegex.exec(content)) !== null) {
    const path = match[1];
    const component = match[2];
    const hash = generateRouteHash(path, component);
    routes[hash] = true;
  }
  
  return routes;
}

/**
 * Check if a route already exists
 * @param {Object} routeHashMap - Hash map of existing routes
 * @param {string} path - Route path
 * @param {string} component - Route component
 * @returns {boolean} - Whether the route exists
 */
export function checkForExistingRoute(routeHashMap, path, component) {
  const hash = generateRouteHash(path, component);
  return !!routeHashMap[hash];
}

/**
 * Create indices for route paths and components
 * @param {string} content - Route configuration content
 * @returns {Object} - Indices
 */
export function createRouteIndices(content) {
  const pathIndex = {};
  const componentIndex = {};
  
  // Extract all paths
  const pathRegex = /path:\s*['"]([^'"]+)['"]/g;
  let pathMatch;
  while ((pathMatch = pathRegex.exec(content)) !== null) {
    const path = pathMatch[1];
    pathIndex[path] = (pathIndex[path] || 0) + 1;
  }
  
  // Extract all components
  const componentRegex = /component:\s*['"]([^'"]+)['"]/g;
  let componentMatch;
  while ((componentMatch = componentRegex.exec(content)) !== null) {
    const component = componentMatch[1];
    componentIndex[component] = (componentIndex[component] || 0) + 1;
  }
  
  return { pathIndex, componentIndex };
}

/**
 * Simple bloom filter implementation for efficient duplicate checking
 */
export class SimpleBloomFilter {
  constructor(size = 1000, hashFunctions = 3) {
    this.size = size;
    this.hashFunctions = hashFunctions;
    this.bitArray = new Array(size).fill(0);
  }
  
  // Simple hash function
  hash(str, seed) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) * seed;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash % this.size);
  }
  
  add(item) {
    for (let i = 0; i < this.hashFunctions; i++) {
      const index = this.hash(item, i + 1);
      this.bitArray[index] = 1;
    }
  }
  
  mightContain(item) {
    for (let i = 0; i < this.hashFunctions; i++) {
      const index = this.hash(item, i + 1);
      if (this.bitArray[index] === 0) {
        return false;
      }
    }
    return true; // Might contain (could be false positive)
  }
}

/**
 * Create a bloom filter for routes
 * @param {string} content - Route configuration content
 * @returns {SimpleBloomFilter} - Bloom filter
 */
export function createRouteBloomFilter(content) {
  const bloomFilter = new SimpleBloomFilter();
  
  // Extract all routes
  const routeRegex = /{\s*path:\s*['"]([^'"]+)['"]\s*,\s*component:\s*['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = routeRegex.exec(content)) !== null) {
    const path = match[1];
    const component = match[2];
    const hash = `${path}|${component}`.toLowerCase();
    bloomFilter.add(hash);
  }
  
  return bloomFilter;
}

/**
 * Validate a page object
 * @param {Object} page - Page object to validate
 * @returns {Object} - Validation result
 */
export function validatePage(page) {
  const errors = [];
  
  // Check required fields
  if (!page.name) {
    errors.push('Missing required field: name');
  }
  
  if (!page.path) {
    errors.push('Missing required field: path');
  }
  
  if (!page.description) {
    errors.push('Missing required field: description');
  }
  
  // Check path format
  if (page.path && !page.path.endsWith('.tsx')) {
    errors.push('Invalid path format: must end with .tsx');
  }
  
  // Check potential routes
  if (page.potentialRoutes && !Array.isArray(page.potentialRoutes)) {
    errors.push('Invalid potentialRoutes: must be an array');
  }
  
  // Check dependencies
  if (page.dependencies && !Array.isArray(page.dependencies)) {
    errors.push('Invalid dependencies: must be an array');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
