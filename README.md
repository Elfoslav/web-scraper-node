# Web scrapper

How to scrape web using Node.js with Puppeteer, store scraped data into PostgreSQL and show them using React and REST API.

## How to run

Docker is not configured properly yet, so you have to run the app with npm.

### PostgreSQL configuration

If you do not have PostgreSQL installed, you have to [install it](https://www.postgresql.org/download/).

Start PostgreSQL server and copy & paste the content of `init.sql` file from this repository. This should create database and tables.

### Client

```
cd client && npm i && npm start
```

### Server

```
cd server && npm i && npm start
```
