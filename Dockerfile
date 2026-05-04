FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port (will be overridden by --port argument)
EXPOSE 3000

# Set entrypoint
ENTRYPOINT ["node", "dist/cli.js"]

# Default command (can be overridden)
CMD ["--port", "3000", "--origin", "http://dummyjson.com"]