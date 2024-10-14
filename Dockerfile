# Use the official Node.js 18 image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Set the environment to production (can be changed to development as needed)
ENV NODE_ENV=development

# Run the application
CMD ["yarn", "run", "start:dev"]
