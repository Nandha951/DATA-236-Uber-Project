# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (defaulting to 3000)
# Adjust if your app uses a different port (check app.js or environment variables)
EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"] 