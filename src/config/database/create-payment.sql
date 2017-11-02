CREATE TABLE payment (
	id BIGSERIAL PRIMARY KEY NOT NULL,
	user_uuid UUID REFERENCES users(user_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
	payment varchar(100) UNIQUE NOT NULL,
  expiration_m smallint NOT NULL,
  expiration_d varchar(100) NOT NULL,
  country varchar(100) REFERENCES country(country),
  zip int NOT NULL,
  theTime timestamptz NOT NULL DEFAULT now()
);
