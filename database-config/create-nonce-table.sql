--create none table

CREATE TABLE nonce (
  email varchar(100) UNIQUE REFERENCES users(email) ON DELETE CASCADE ON UPDATE CASCADE,
  nonce varchar(100),
  theTime timestamptz NOT NULL DEFAULT now()
);
