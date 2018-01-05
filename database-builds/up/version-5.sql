
CREATE FUNCTION set_updated_timestamp()
  RETURNS TRIGGER
  LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_timestamp := now();
  RETURN NEW;
END;
$$;


ALTER TABLE users ADD COLUMN create_timestamp timestamptz NOT NULL DEFAULT now()
ALTER TABLE users ADD COLUMN updated_timestamp timestamptz NOT NULL DEFAULT now();
CREATE TRIGGER alarms_on_update_timestamp
  BEFORE UPDATE ON alarms
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

ALTER TABLE nonce RENAME theTime TO created_timestamp;

ALTER TABLE alarms RENAME thedate TO created_timestamp;
ALTER TABLE alarms ADD COLUMN id BIGSERIAL PRIMARY KEY NOT NULL;
ALTER TABLE alarms ADD COLUMN alarm_id numeric default 1; -- must be updated via select and update on server
ALTER TABLE alarms ADD COLUMN updated_timestamp timestamptz NOT NULL DEFAULT now();
CREATE TRIGGER alarms_on_update_timestamp
  BEFORE UPDATE ON alarms
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();


-- Master Card, Visa, Discover, American Express
CREATE TABLE payment_credit (
  user_uuid UUID REFERENCES users(user_uuid) ON DELETE CASCADE,
  card_number varchar(20) UNIQUE NOT NULL, -- will validate and encrypt on server lvl
  name varchar(100) NOT NULL CHECK(name ~ '^([a-zA-Z]{1,15})( [a-zA-Z]{1,15})?([ -]?[a-zA-Z]{1,15})?$'),
  exp_month varchar(20) NOT NULL CHECK (exp_month ~ '^[\d]{2}$'),
  exp_date varchar(20) NOT NULL CHECK (exp_date ~ '^[\d]{2}$'),
  cvv varchar(20) NOT NULL CHECK (cvv ~ '^[\d]{3,4}$'),
  address_1 varchar(100) NOT NULL CHECK (address_1 ~ '^[\da-zA-Z]{1,20}$'), -- could validate server level as well
  address_2 varchar(100) CHECK (address_2 ~ '^[\da-zA-Z]{1,20}$'),
  city varchar(20) NOT NULL CHECK (city ~ '^[\da-zA-Z]{1,20}$'),
  state varchar(20) NOT NULL CHECK (state ~ '^[A-Z]{2}'),
  zip varchar(20) NOT NULL CHECK (zip ~ '^\d{5}$'),
  active boolean default TRUE
);


CREATE TRIGGER products_on_update_timestamp
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  product_id varchar(20) UNIQUE NOT NULL CHECK (product_id ~ '([A-Z\d]{4})-([A-Z]{1})-([A-Z\d]{4})-([\d]{4})'),
  universal_id varchar(20) NOT NULL CHECK (universal_id ~ '^[\d]{12}$'),  -- could be a lot better, probably validate server lvl too
  price numeric(10,2) NOT NULL,
  name varchar(100) NOT NULL UNIQUE CHECK (name ~ '^[A-Za-z\d ]{1,30}$'),
  description varchar(100) NOT NULL CHECK (name ~ '^[A-Za-z\d ]{1,99}$'),
  size varchar(20) CHECK (size ~ '^[sml]{1}$'),
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, updated_timestamp)
);

CREATE TABLE cart (
  user_uuid UUID REFERENCES users(user_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
  product_id varchar(20) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
  price numeric(10,2),
  name varchar(100) REFERENCES products(name) ON DELETE CASCADE ON UPDATE CASCADE,
  size varchar(20),
  quantity numeric(10) NOT NULL default 1,
  card_number varchar(20) REFERENCES payment_credit(card_number),
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);


CREATE OR REPLACE FUNCTION function_copy() RETURNS TRIGGER AS
$BODY$
BEGIN
    INSERT INTO
        price_history(product_id,updated_timestamp, price)
        VALUES(new.product_id,new.updated_timestamp, new.price);
           RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER trig_copy
    AFTER INSERT ON products
    FOR EACH ROW
    EXECUTE PROCEDURE function_copy();

CREATE TRIGGER trig_update
    AFTER UPDATE ON products
    FOR EACH ROW
    EXECUTE PROCEDURE function_copy();


CREATE TABLE price_history (
  product_id varchar(20) NOT NULL CHECK (product_id ~ '([A-Z\d]{4})-([A-Z]{1})-([A-Z\d]{4})-([\d]{4})'),
  price numeric(10,2) NOT NULL,
  updated_timestamp timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, updated_timestamp)
);

CREATE TABLE orders (
  user_uuid UUID REFERENCES users(user_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
  card_number varchar(20) REFERENCES payment_credit(card_number),
  items varchar[],
  total -- use totals from cart page
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE session (
  user_uuid UUID REFERENCES users(user_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
  sessionID varchar(100) NOT NULL UNIQUE,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);
