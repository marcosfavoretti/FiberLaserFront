# Use the official Node.js image as the base image for building the Angular app
FROM node:22 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN npm run build --prod

# Use the official Nginx image to serve the Angular app
FROM nginx:alpine

# Copy the built Angular app from the build stage to the Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom nginx.conf to the container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]