FROM node:alpine AS builder

# Set working directory
WORKDIR /server

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application source code
COPY . .

# Build step 
RUN npm run build



FROM node:alpine

# Set working directory
WORKDIR /server

# Copy build
COPY --from=builder /server/dist ./dist
COPY --from=builder /server/tsconfig.json .
COPY --from=builder /server/package.json ./package.json
COPY --from=builder /server/node_modules ./node_modules

# Expose the serverlication port
EXPOSE 8000

# Correctly run the server using Node.js
CMD ["npm","start"]
