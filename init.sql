CREATE EXTENSION IF NOT EXISTS dblink;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'scraper') THEN
    PERFORM dblink_exec('', 'CREATE DATABASE scraper');
  END IF;
END $$;

\c scraper;

CREATE TABLE IF NOT EXISTS flats (
  ID SERIAL PRIMARY KEY,
  title VARCHAR(100),
  locality VARCHAR(100),
  price VARCHAR(50),
  images text[]
);
