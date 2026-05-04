import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';
import { ProxyService } from './proxy/proxy.service';

export async function createApp(port: number, origin: string) {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger: ['error', 'warn', 'log'],
  });

  // Enable body parsing middleware for all content types with 10mb limit
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(express.text({ limit: '10mb' }));

  // Set origin in proxy service
  const proxyService = app.get(ProxyService);
  proxyService.setOrigin(origin);

  await app.listen(port);

  console.log(`\n🚀 Caching proxy server is running on http://localhost:${port}`);
  console.log(`📡 Forwarding requests to: ${origin}\n`);

  return app;
}