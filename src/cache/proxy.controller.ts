import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { CacheService, CachedResponse } from '../cache/cache.service';

@Injectable()
export class ProxyService {
  private originUrl: string;

  constructor(private readonly cacheService: CacheService) {}

  setOrigin(url: string): void {
    this.originUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  }

  getOrigin(): string {
    return this.originUrl;
  }

  async forwardRequest(
    path: string,
    method: string,
    headers: Record<string, string>,
    body?: any,
  ): Promise<{ data: any; headers: Record<string, string>; statusCode: number; fromCache: boolean }> {
    const targetUrl = `${this.originUrl}${path}`;
    
    // Check cache for GET requests
    if (method === 'GET') {
      const cachedResponse = this.cacheService.get(targetUrl, method);
      if (cachedResponse) {
        console.log(`Cache HIT: ${method} ${targetUrl}`);
        return {
          data: cachedResponse.data,
          headers: cachedResponse.headers,
          statusCode: cachedResponse.statusCode,
          fromCache: true,
        };
      }
    }

    console.log(`Cache MISS: ${method} ${targetUrl}`);
    
    // Forward request to origin server
    try {
      // Remove host header to avoid conflicts
      const forwardHeaders = { ...headers };
      delete forwardHeaders.host;
      delete forwardHeaders['content-length'];

      const config: AxiosRequestConfig = {
        method: method.toLowerCase() as any,
        url: targetUrl,
        headers: forwardHeaders,
        validateStatus: () => true, // Accept any status code
      };

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.data = body;
      }

      const response = await axios(config);

      // Prepare response headers
      const responseHeaders: Record<string, string> = {};
      Object.keys(response.headers).forEach(key => {
        responseHeaders[key] = String(response.headers[key]);
      });

      // Cache GET requests
      if (method === 'GET' && response.status >= 200 && response.status < 300) {
        const cachedResponse: CachedResponse = {
          data: response.data,
          headers: responseHeaders,
          statusCode: response.status,
          timestamp: Date.now(),
        };
        this.cacheService.set(targetUrl, method, cachedResponse);
      }

      return {
        data: response.data,
        headers: responseHeaders,
        statusCode: response.status,
        fromCache: false,
      };
    } catch (error) {
      console.error(`Error forwarding request to ${targetUrl}:`, error.message);
      throw error;
    }
  }
}