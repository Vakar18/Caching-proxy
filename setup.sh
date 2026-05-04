#!/bin/bash

# Caching Proxy Server - Setup Script

echo "🚀 Setting up Caching Proxy Server..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Make CLI executable
echo "🔧 Making CLI executable..."
chmod +x dist/cli.js

echo "✅ Setup complete!"
echo ""
echo "Usage:"
echo "  Start server: npm run cli -- --port 3000 --origin http://dummyjson.com"
echo "  Clear cache:  npm run cli -- --clear-cache"
echo ""