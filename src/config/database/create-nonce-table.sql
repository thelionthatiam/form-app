--create none table

CREATE TABLE nonce (
  user_uuid UUID UNIQUE REFERENCES users(user_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
  nonce varchar(100),
  theTime timestamptz NOT NULL DEFAULT now()
);
