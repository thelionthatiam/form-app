CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE users (
	id BIGSERIAL PRIMARY KEY NOT NULL,
	user_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
	email varchar(100) UNIQUE NOT NULL CHECK (email ~ '^[A-Za-z0-9\._\$%\-]+@[A-Za-z0-9\-]+.[A-Za-z0-9]{2,6}$'),
	phone varchar(20) NOT NULL CHECK (phone ~ '^[0-9]+$'),
	password varchar(100) NOT NUll,
	name varchar(100) default 'USER' CHECK(name ~ '^([a-zA-Z]{1,15})( [a-zA-Z]{1,15})?([ -]?[a-zA-Z]{1,15})?$')
);

CREATE TABLE nonce (
  user_uuid UUID UNIQUE REFERENCES users(user_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
  nonce varchar(100),
  theTime timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE alarms (
	id BIGSERIAL PRIMARY KEY NOT NULL,
  user_uuid UUID NOT NULL REFERENCES users(user_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
  title varchar(100) UNIQUE NOT NULL DEFAULT 'alarm' CHECK (title ~ '^[ 0-9a-zA-Z!@#$%^&*()_+]{1,15}$'),
  time time NOT NULL default '120000',
  thedate date NOT NULL DEFAULT now(),
	active boolean DEFAULT TRUE
);
