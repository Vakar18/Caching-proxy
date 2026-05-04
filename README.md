# Caching Proxy Server

A caching proxy server built with NestJS that forwards requests to an origin server and caches responses for improved performance.

## Features

- ✅ Forward HTTP requests to origin server
- ✅ Cache GET request responses
- ✅ Add `X-Cache` header (HIT/MISS) to indicate cache status
- ✅ Persistent cache storage (saved to disk)
- ✅ Clear cache command
- ✅ Support for all HTTP methods (GET, POST, PUT, DELETE, etc.)
- ✅ Preserve original response headers and status codes

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### Start the Caching Proxy Server

```bash
npm run cli -- --port <number> --origin <url>
```

**Example:**
```bash
npm run cli -- --port 3000 --origin http://dummyjson.com
```

This will:
- Start the proxy server on port 3000
- Forward all requests to `http://dummyjson.com`
- Cache GET request responses

### Make Requests

Once the server is running, you can make requests to it:

```bash
# First request - Cache MISS (fetches from origin)
curl http://localhost:3000/products

# Second request - Cache HIT (returns cached response)
curl http://localhost:3000/products

# Check headers to see cache status
curl -I http://localhost:3000/products
```

The response will include an `X-Cache` header:
- `X-Cache: MISS` - Response fetched from origin server
- `X-Cache: HIT` - Response served from cache

### Clear Cache

```bash
npm run cli -- --clear-cache
```

This will delete all cached responses.

## Project Structure

```
caching-proxy/
├── src/
│   ├── cache/
│   │   └── cache.service.ts      # Cache management logic
│   ├── proxy/
│   │   ├── proxy.controller.ts   # HTTP request handler
│   │   ├── proxy.service.ts      # Request forwarding logic
│   │   └── proxy.module.ts       # Proxy module
│   ├── app.module.ts              # Main app module
│   ├── main.ts                    # Application entry point
│   └── cli.ts                     # CLI tool
├── .cache/                        # Cache storage directory
│   └── cache.json                 # Cached responses
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

## How It Works

1. **Request Handling**: When a request comes in, the proxy controller receives it
2. **Cache Check**: For GET requests, the cache service checks if a cached response exists
3. **Cache HIT**: If found, the cached response is returned with `X-Cache: HIT` header
4. **Cache MISS**: If not found, the request is forwarded to the origin server
5. **Response Caching**: Successful GET responses (2xx status codes) are cached
6. **Persistent Storage**: Cache is saved to disk in `.cache/cache.json`

## Technical Details

- **Framework**: NestJS (Node.js framework)
- **HTTP Client**: Axios (for forwarding requests)
- **CLI**: Commander.js (for command-line interface)
- **Cache Storage**: In-memory Map + JSON file persistence
- **Supported Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD

## Development

```bash
# Development mode with auto-reload
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod
```

## Examples

### Example 1: Fetching Products

```bash
# Start server
npm run cli -- --port 3000 --origin http://dummyjson.com

# First request (MISS)
curl http://localhost:3000/products
# X-Cache: MISS

# Second request (HIT)
curl http://localhost:3000/products
# X-Cache: HIT
```

### Example 2: Different Endpoints

```bash
# Each unique URL is cached separately
curl http://localhost:3000/products/1    # MISS
curl http://localhost:3000/products/1    # HIT
curl http://localhost:3000/products/2    # MISS
curl http://localhost:3000/products/2    # HIT
```

### Example 3: POST Requests (Not Cached)

```bash
# POST requests are forwarded but not cached
curl -X POST http://localhost:3000/products/add \
  -H "Content-Type: application/json" \
  -d '{"title": "New Product"}'
# X-Cache: MISS (always)
```

## Requirements Met

✅ CLI tool with `--port` and `--origin` options  
✅ Forward requests to origin server  
✅ Cache responses  
✅ Return cached responses on subsequent requests  
✅ Add `X-Cache: HIT/MISS` headers  
✅ Clear cache command with `--clear-cache`  
✅ Preserve original headers and status codes  

## License

ISC# Caching-proxy
