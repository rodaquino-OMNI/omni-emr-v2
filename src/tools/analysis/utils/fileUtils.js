/**
 * File Utilities for Orphaned Pages Analysis
 * 
 * This module provides utility functions for file operations used in the orphaned pages analysis.
 */

import fs from 'fs';
import path from 'path';

/**
 * Read a file with error handling
 * @param {string} filePath - Path to the file
 * @returns {string|null} - File content or null if error
 */
export function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

/**
 * Write content to a file with error handling
 * @param {string} filePath - Path to the file
 * @param {string} content - Content to write
 * @returns {boolean} - Success status
 */
export function writeFile(filePath, content) {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully wrote to ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    return false;
  }
}

/**
 * Get file stats with error handling
 * @param {string} filePath - Path to the file
 * @returns {fs.Stats|null} - File stats or null if error
 */
export function getFileStats(filePath) {
  try {
    return fs.statSync(filePath);
  } catch (error) {
    console.error(`Error getting file stats for ${filePath}:`, error);
    return null;
  }
}

/**
 * Find a file in a directory or its subdirectories
 * @param {string} baseDir - Base directory to search in
 * @param {string} fileName - File name to find
 * @returns {string|null} - Full path to the file or null if not found
 */
export function findFile(baseDir, fileName) {
  // Check for direct match
  const directPath = path.join(baseDir, fileName);
  if (fs.existsSync(directPath)) {
    return directPath;
  }

  // Search recursively
  const searchDirectory = (dir) => {
    try {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          const result = searchDirectory(filePath);
          if (result) return result;
        } else if (file === fileName) {
          return filePath;
        }
      }
    } catch (error) {
      console.error(`Error searching directory ${dir}:`, error);
    }
    return null;
  };

  return searchDirectory(baseDir);
}

/**
 * Check if a file exists
 * @param {string} filePath - Path to the file
 * @returns {boolean} - Whether the file exists
 */
export function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Create a backup of a file
 * @param {string} filePath - Path to the file
 * @returns {boolean} - Success status
 */
export function backupFile(filePath) {
  try {
    const backupPath = `${filePath}.bak`;
    fs.copyFileSync(filePath, backupPath);
    console.log(`Backed up ${filePath} to ${backupPath}`);
    return true;
  } catch (error) {
    console.error(`Error backing up file ${filePath}:`, error);
    return false;
  }
}