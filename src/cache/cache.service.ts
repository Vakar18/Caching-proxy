import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface CachedResponse {
  data: any;
  headers: Record<string, string>;
  statusCode: number;
  timestamp: number;
}

@Injectable()
export class CacheService {
  private cache: Map<string, CachedResponse> = new Map();
  private readonly cacheDir = path.join(process.cwd(), '.cache');

  constructor() {
    this.loadCacheFromDisk();
  }

  private getCacheKey(url: string, method: string): string {
    return `${method}:${url}`;
  }

  get(url: string, method: string = 'GET'): CachedResponse | null {
    const key = this.getCacheKey(url, method);
    return this.cache.get(key) || null;
  }

  set(url: string, method: string, response: CachedResponse): void {
    const key = this.getCacheKey(url, method);
    this.cache.set(key, response);
    this.saveCacheToDisk();
  }

  clear(): void {
    this.cache.clear();
    this.clearCacheFromDisk();
  }

  has(url: string, method: string = 'GET'): boolean {
    const key = this.getCacheKey(url, method);
    return this.cache.has(key);
  }

  private loadCacheFromDisk(): void {
    try {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
        return;
      }

      const cacheFile = path.join(this.cacheDir, 'cache.json');
      if (fs.existsSync(cacheFile)) {
        const data = fs.readFileSync(cacheFile, 'utf-8');
        const cacheData = JSON.parse(data);
        this.cache = new Map(Object.entries(cacheData));
        console.log(`Loaded ${this.cache.size} cached entries from disk`);
      }
    } catch (error) {
      console.error('Error loading cache from disk:', error.message);
    }
  }

  private saveCacheToDisk(): void {
    try {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      }

      const cacheFile = path.join(this.cacheDir, 'cache.json');
      const cacheData = Object.fromEntries(this.cache);
      fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2));
    } catch (error) {
      console.error('Error saving cache to disk:', error.message);
    }
  }

  private clearCacheFromDisk(): void {
    try {
      const cacheFile = path.join(this.cacheDir, 'cache.json');
      if (fs.existsSync(cacheFile)) {
        fs.unlinkSync(cacheFile);
        console.log('Cache cleared from disk');
      }
    } catch (error) {
      console.error('Error clearing cache from disk:', error.message);
    }
  }
}