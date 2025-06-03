# Use official Node.js 20 image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Expose port 5050
EXPOSE 5050

# Start command
CMD ["npm", "start"]