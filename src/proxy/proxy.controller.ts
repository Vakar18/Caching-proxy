import {
  Controller,
  All,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';

@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('*')
  async proxy(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const path = req.path;
      const method = req.method;
      const headers = req.headers as Record<string, string>;
      const body = req.body;

      const result = await this.proxyService.forwardRequest(
        path,
        method,
        headers,
        body,
      );

      // Set response headers
      Object.entries(result.headers).forEach(([key, value]) => {
        if (key.toLowerCase() !== 'content-length') {
          res.setHeader(key, value);
        }
      });

      // Add cache status header
      res.setHeader('X-Cache', result.fromCache ? 'HIT' : 'MISS');

      res.status(result.statusCode).send(result.data);
    } catch (error) {
      console.error('Proxy error:', error);
      throw new HttpException(
        'Failed to proxy request',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
