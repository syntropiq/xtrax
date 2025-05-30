import { readFile, stat } from 'fs/promises';
import { join, resolve } from 'path';
import type { FileLoadOptions, LoadResult, CacheEntry } from './types.js';
import { validateDataWithSchema } from './json-validator.js';

// Simple in-memory cache
const fileCache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_MAX_CACHE_SIZE = 100;

/**
 * Load a JSON file with error handling
 */
export async function loadJSONFile<T = unknown>(
  filePath: string, 
  options: FileLoadOptions = {}
): Promise<T> {
  const { encoding = 'utf8', maxSize = 50 * 1024 * 1024 } = options; // 50MB default max
  
  try {
    // Check file size
    const stats = await stat(filePath);
    if (maxSize && stats.size > maxSize) {
      throw new Error(`File ${filePath} exceeds maximum size of ${maxSize} bytes`);
    }
    
    const content = await readFile(filePath, { encoding });
    const data = JSON.parse(content);
    return data as T;
  } catch (error) {
    throw new Error(`Failed to load JSON file ${filePath}: ${error}`);
  }
}

/**
 * Load a JSON file with detailed metadata
 */
export async function loadJSONFileWithMetadata<T = unknown>(
  filePath: string,
  options: FileLoadOptions = {}
): Promise<LoadResult<T>> {
  const startTime = Date.now();
  const absolutePath = resolve(filePath);
  
  try {
    const stats = await stat(absolutePath);
    const data = await loadJSONFile<T>(absolutePath, options);
    const loadTime = Date.now() - startTime;
    
    return {
      data,
      metadata: {
        filePath: absolutePath,
        loadTime,
        fileSize: stats.size
      }
    };
  } catch (error) {
    throw new Error(`Failed to load file with metadata: ${error}`);
  }
}

/**
 * Load and validate a JSON file against a schema
 */
export async function loadDataWithSchema<T>(
  dataPath: string,
  schemaPath: string,
  options: FileLoadOptions = {}
): Promise<T> {
  const startTime = Date.now();
  
  try {
    const data = await loadJSONFile(dataPath, options);
    const validationResult = await validateDataWithSchema<T>(data, schemaPath);
    
    if (!validationResult.isValid) {
      const errorMessages = validationResult.errors.map(e => 
        `${e.instancePath}: ${e.message}`
      ).join(', ');
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    
    return validationResult.data!;
  } catch (error) {
    throw new Error(`Failed to load and validate data: ${error}`);
  }
}

/**
 * Load multiple JSON files from a directory
 */
export async function loadJSONFiles<T = unknown>(
  dirPath: string,
  filePattern: RegExp = /\.json$/,
  options: FileLoadOptions = {}
): Promise<Record<string, T>> {
  const { readdir } = await import('fs/promises');
  
  try {
    const files = await readdir(dirPath);
    const jsonFiles = files.filter(file => filePattern.test(file));
    
    const results: Record<string, T> = {};
    
    await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = join(dirPath, file);
        const data = await loadJSONFile<T>(filePath, options);
        const fileName = file.replace(/\.json$/, '');
        results[fileName] = data;
      })
    );
    
    return results;
  } catch (error) {
    throw new Error(`Failed to load JSON files from ${dirPath}: ${error}`);
  }
}

/**
 * Load JSON with caching
 */
export async function loadJSONFileWithCache<T = unknown>(
  filePath: string,
  options: FileLoadOptions = {}
): Promise<T> {
  const { cache = true } = options;
  const absolutePath = resolve(filePath);
  
  if (cache && fileCache.has(absolutePath)) {
    const entry = fileCache.get(absolutePath)!;
    
    // Check if file has been modified
    try {
      const stats = await stat(absolutePath);
      if (stats.mtime.getTime() <= entry.timestamp) {
        return entry.data as T;
      }
    } catch {
      // File might not exist anymore, remove from cache
      fileCache.delete(absolutePath);
    }
  }
  
  const data = await loadJSONFile<T>(absolutePath, options);
  
  if (cache) {
    // Maintain cache size limit
    if (fileCache.size >= DEFAULT_MAX_CACHE_SIZE) {
      const firstKey = fileCache.keys().next().value;
      if (firstKey) {
        fileCache.delete(firstKey);
      }
    }
    
    fileCache.set(absolutePath, {
      data,
      timestamp: Date.now(),
      filePath: absolutePath
    });
  }
  
  return data;
}

/**
 * Clear the file cache
 */
export function clearFileCache(): void {
  fileCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; entries: string[] } {
  return {
    size: fileCache.size,
    entries: Array.from(fileCache.keys())
  };
}
