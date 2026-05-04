# Caching Proxy - Installation & Usage Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

If you encounter any issues, try:
```bash
npm install --legacy-peer-deps
```

### 2. Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### 3. Run the Server

```bash
npm run cli -- --port 3000 --origin http://dummyjson.com
```

**Important**: The `--` after `npm run cli` is required to pass arguments to the script.

## Commands

### Start Server
```bash
npm run cli -- --port <PORT> --origin <URL>
```

Example:
```bash
npm run cli -- --port 3000 --origin http://dummyjson.com
```

### Clear Cache
```bash
npm run cli -- --clear-cache
```

## Testing the Server

### Using curl

```bash
# First request - will fetch from origin (MISS)
curl -i http://localhost:3000/products

# Second request - will return from cache (HIT)
curl -i http://localhost:3000/products

# Different endpoint
curl -i http://localhost:3000/products/1
```

### Using Browser

Simply navigate to:
- http://localhost:3000/products
- http://localhost:3000/users
- http://localhost:3000/posts

Check the Network tab in DevTools to see the `X-Cache` header.

### Using Postman

1. Create a new GET request
2. Set URL to `http://localhost:3000/products`
3. Send the request twice
4. Check the Headers tab to see `X-Cache: MISS` then `X-Cache: HIT`

## Verifying Cache Behavior

### Check Cache Status

The `X-Cache` header indicates cache status:
- **X-Cache: MISS** - Response fetched from origin server
- **X-Cache: HIT** - Response served from cache

```bash
curl -I http://localhost:3000/products | grep X-Cache
```

### View Cached Data

The cache is stored in `.cache/cache.json`. You can view it:

```bash
cat .cache/cache.json
```

### Clear and Verify

```bash
# Clear cache
npm run cli -- --clear-cache

# Make a request (should be MISS)
curl -i http://localhost:3000/products | grep X-Cache
# Output: X-Cache: MISS

# Make same request again (should be HIT)
curl -i http://localhost:3000/products | grep X-Cache
# Output: X-Cache: HIT
```

## Troubleshooting

### Port Already in Use

If you get "port already in use" error:

```bash
# Find process using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
npm run cli -- --port 3001 --origin http://dummyjson.com
```

### Build Errors

If build fails:

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Cache Not Working

If caching doesn't work:

```bash
# Check if .cache directory exists
ls -la .cache

# Clear cache and try again
npm run cli -- --clear-cache
npm run cli -- --port 3000 --origin http://dummyjson.com
```

## Advanced Usage

### Different Origin Servers

You can proxy to any HTTP server:

```bash
# JSONPlaceholder
npm run cli -- --port 3000 --origin https://jsonplaceholder.typicode.com

# Your own API
npm run cli -- --port 3000 --origin http://localhost:8080
```

### Testing POST Requests

POST requests are forwarded but not cached:

```bash
curl -X POST http://localhost:3000/products/add \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Product",
    "price": 29.99
  }'
```

### Checking Request Methods

```bash
# GET - cached
curl -X GET http://localhost:3000/products

# POST - not cached
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# PUT - not cached
curl -X PUT http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated"}'
```

## Performance Testing

### Using Apache Bench

```bash
# Test without cache (first run)
npm run cli -- --clear-cache
ab -n 100 -c 10 http://localhost:3000/products

# Test with cache (second run)
ab -n 100 -c 10 http://localhost:3000/products
```

You should see significant performance improvement with cache.

### Using curl with timing

```bash
# First request (MISS)
time curl http://localhost:3000/products > /dev/null

# Second request (HIT) - should be much faster
time curl http://localhost:3000/products > /dev/null
```

## Project Structure Explained

```
caching-proxy/
├── src/
│   ├── cache/
│   │   └── cache.service.ts      # Handles caching logic, storage
│   ├── proxy/
│   │   ├── proxy.controller.ts   # Receives HTTP requests
│   │   ├── proxy.service.ts      # Forwards to origin server
│   │   └── proxy.module.ts       # NestJS module definition
│   ├── app.module.ts              # Root module
│   ├── main.ts                    # App initialization
│   └── cli.ts                     # Command-line interface
├── .cache/                        # Cache storage (created at runtime)
│   └── cache.json                 # Cached responses in JSON
├── dist/                          # Compiled JavaScript (after build)
├── node_modules/                  # Dependencies
├── package.json                   # Project metadata & scripts
├── tsconfig.json                  # TypeScript config
├── nest-cli.json                  # NestJS config
└── README.md                      # Documentation
```

## Common Use Cases

### 1. API Rate Limiting Protection
Reduce calls to rate-limited APIs by caching responses.

### 2. Slow API Optimization
Cache responses from slow third-party APIs for faster access.

### 3. Development Testing
Use cached responses during development to avoid hitting real APIs.

### 4. Cost Reduction
Reduce API costs by caching expensive API calls.

## Next Steps

After successful setup, you can:

1. Test with different origin servers
2. Modify cache TTL (time-to-live) in `cache.service.ts`
3. Add cache invalidation rules
4. Implement cache size limits
5. Add request/response logging
6. Create Docker container for deployment

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the code in `src/` directory
3. Check console logs for error messages