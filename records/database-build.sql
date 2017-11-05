CREATE DATABASE newdata;
CREATE USER newuser;
\connect newdata;
GRANT ALL PRIVILEGES ON DATABASE newdata TO newuser;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE users (
	id BIGSERIAL PRIMARY KEY NOT NULL,
	user_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
	email varchar(100) UNIQUE NOT NULL CHECK (email ~ '^[A-Za-z0-9\._\$%\-]+@[A-Za-z0-9\-]+.[A-Za-z0-9]{2,6}$'),
	phone varchar(20) NOT NULL CHECK (phone ~ '^[0-9]+$'),
	password varchar(100) NOT NUll
);
CREATE TABLE nonce (
  user_uuid UUID UNIQUE REFERENCES users(user_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
  nonce varchar(100),
  theTime timestamptz NOT NULL DEFAULT now()
);
