# Base image
FROM node:lts

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json for both client and server
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies for both client and server
RUN cd client && npm install
RUN cd server && npm install

# Copy the source code for both client and server
COPY client/ ./client/
COPY server/ ./server/

# Expose the server port
EXPOSE 5001

# Start the React development server and the ExpressJS server
CMD cd client && npm run start & cd server && npm run migrate up && node index.js
