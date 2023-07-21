# Use an official Node.js runtime as a base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all authentication service files to the container
COPY . .

# Expose the port your authentication service runs on (assuming it's 5001)
EXPOSE 5001

# Define the command to run your authentication service
CMD ["node", "auth-service.js"]
