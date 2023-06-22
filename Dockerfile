# Use the official PostgreSQL image as the base
FROM postgres:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the init.sql file into the container
COPY init.sql /docker-entrypoint-initdb.d/init.sql

# Install Node.js
RUN apt-get update && apt-get install -y nodejs npm

# Copy the client and server folders into the container
COPY client /app/client
COPY server /app/server

# Install npm packages for the client and server
RUN cd /app/client && npm install
RUN cd /app/server && npm install

# Set the environment variables for the server
ARG DB_HOST
ARG DB_USER
ARG DB_DATABASE
ARG DB_PASSWORD
ENV PGHOST=${DB_HOST}
ENV PGUSER=${DB_USER}
ENV PGDATABASE=${DB_DATABASE}
ENV PGPASSWORD=${DB_PASSWORD}

# Expose the necessary ports
EXPOSE 3000

# Start PostgreSQL and then the client and server
CMD service postgresql start && cd /app/client && npm start & cd /app/server && npm start
