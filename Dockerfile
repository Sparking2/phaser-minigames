# Use the official Node.js LTS image as the base
FROM node:lts
LABEL authors="Alfonso Márquez"

# Set the working directory within the container
WORKDIR /app/phaser-game

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install pnpm globally using npm
RUN npm install -g pnpm

# Install project dependencies using pnpm
RUN pnpm install

# Copy the rest of the application files into the container
COPY . .

# Build your website (adjust the build command based on your project)
RUN pnpm run build

# Expose the port your website listens on (if applicable)
EXPOSE 8080

RUN pwd

RUN ls