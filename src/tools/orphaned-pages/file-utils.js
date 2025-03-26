/**
 * File operation utilities for the Orphaned Pages Manager
 * Enhanced with robust error handling and retry mechanisms
 */

import fs from 'fs';
import path from 'path';

/**
 * Read a file with retry mechanism
 * @param {string} filePath - Path to the file
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} retryDelay - Delay between retries in ms
 * @returns {Promise<string>} - File content
 */
export async function readFileWithRetry(filePath, maxRetries = 3, retryDelay = 1000) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File not found - no need to retry
        throw new Error(`File not found: ${filePath}`);
      }
      
      if (error.code === 'EACCES') {
        // Permission error - no need to retry
        throw new Error(`Permission denied: ${filePath}`);
      }
      
      if (error.code === 'EBUSY' || error.code === 'EMFILE' || error.code === 'ENFILE') {
        // File is busy or too many open files - retry
        retries++;
        console.warn(`File access error (${error.code}), retrying (${retries}/${maxRetries})...`);
        
        // Wait before retrying
        if (retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, retries - 1)));
        }
        continue;
      }
      
      // Other errors - throw
      throw error;
    }
  }
  
  throw new Error(`Failed to read file after ${maxRetries} retries: ${filePath}`);
}

/**
 * Write to a file with error handling
 * @param {string} filePath - Path to the file
 * @param {string} content - Content to write
 * @returns {Promise<void>}
 */
export async function writeFileWithErrorHandling(filePath, content) {
  try {
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully updated ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error writing file: ${error.message}`);
    
    // Try to restore from backup if available
    const backupPath = `${filePath}.bak`;
    if (fs.existsSync(backupPath)) {
      console.log('Attempting to restore from backup...');
      try {
        fs.copyFileSync(backupPath, filePath);
        console.log('Restored from backup successfully');
      } catch (restoreError) {
        console.error(`Error restoring from backup: ${restoreError.message}`);
      }
    }
    
    throw error;
  }
}

/**
 * Backup a file before modifying it
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} - Whether the backup was successful
 */
export async function backupFile(filePath) {
  const backupPath = `${filePath}.bak`;
  try {
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath);
      console.log(`Backed up ${filePath} to ${backupPath}`);
      return true;
    } else {
      console.warn(`File does not exist, cannot create backup: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`Error backing up file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Check file permissions
 * @param {string} filePath - Path to the file
 * @param {Object} requiredPermissions - Required permissions
 * @returns {Object} - Result object
 */
export function checkFilePermissions(filePath, requiredPermissions = { read: true, write: true }) {
  try {
    // If file doesn't exist, check if we can create it
    if (!fs.existsSync(filePath)) {
      if (requiredPermissions.write) {
        const dirPath = path.dirname(filePath);
        try {
          fs.accessSync(dirPath, fs.constants.W_OK);
          return { success: true }; // Can write to directory
        } catch (dirError) {
          return { success: false, error: `Cannot create file in directory ${dirPath}` };
        }
      }
      return { success: false, error: `File does not exist: ${filePath}` };
    }
    
    const stats = fs.statSync(filePath);
    
    // Check if file exists
    if (!stats.isFile()) {
      return { success: false, error: `${filePath} is not a file` };
    }
    
    // Check read permission
    if (requiredPermissions.read) {
      try {
        fs.accessSync(filePath, fs.constants.R_OK);
      } catch (error) {
        return { success: false, error: `No read permission for ${filePath}` };
      }
    }
    
    // Check write permission
    if (requiredPermissions.write) {
      try {
        fs.accessSync(filePath, fs.constants.W_OK);
      } catch (error) {
        return { success: false, error: `No write permission for ${filePath}` };
      }
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: `Error checking permissions: ${error.message}` };
  }
}

/**
 * Create a directory if it doesn't exist
 * @param {string} dirPath - Path to the directory
 * @returns {Promise<boolean>} - Whether the directory was created or already exists
 */
export async function ensureDirectoryExists(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
      return true;
    }
    return true;
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
    throw error;
  }
}

/**
 * List files in a directory with a specific extension
 * @param {string} dirPath - Path to the directory
 * @param {string} extension - File extension to filter by (e.g., '.tsx')
 * @param {boolean} recursive - Whether to search recursively
 * @returns {Promise<string[]>} - Array of file paths
 */
export async function listFiles(dirPath, extension, recursive = false) {
  try {
    const results = [];
    
    if (!fs.existsSync(dirPath)) {
      return results;
    }
    
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && recursive) {
        const subResults = await listFiles(filePath, extension, recursive);
        results.push(...subResults);
      } else if (stat.isFile() && (!extension || file.endsWith(extension))) {
        results.push(filePath);
      }
    }
    
    return results;
  } catch (error) {
    console.error(`Error listing files in ${dirPath}:`, error);
    throw error;
  }
}