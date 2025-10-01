# Stage 1: Build the app using an Alpine-based Node.js image
FROM node:alpine AS builder

# Set working directory
WORKDIR /client

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application source code
COPY . .

# Build step (if applicable)
RUN npm run build

# Stage 2: Serve the built app using Nginx
FROM nginx:alpine AS server

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default Nginx static files
RUN rm -rf ./*

# Copy the built application from the previous stage
COPY --from=builder /client/dist .

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
