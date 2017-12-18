/*
INSERT timestamp

timestamp timestamp default current_timestamp

*/

/*

UPDATE timestamp:

CREATE FUNCTION set_updated_timestamp()
  RETURNS TRIGGER
  LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_timestamp := now();
  RETURN NEW;
END;
$$;

apply to table:

CREATE TRIGGER test_table_update_timestamp
  BEFORE UPDATE ON test_table
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

testFunction

created
{
  user_uuid: '3e792f4c-1f49-4fcd-808c-fee4203ca056',
  awake: '12:12',
  thedate: 2017-12-18T08:00:00.000Z, <== why is it 8:00 here? It's 12:10
  title: 'new test alarm',
  active: true,
  id: '2',
  updated_timestamp: 2017-12-18T20:09:17.707Z <== why is it 8:00PM here? It's 8:00 am up there and 12:10 irl
}

3 mlater

{
  user_uuid: '3e792f4c-1f49-4fcd-808c-fee4203ca056',
  awake: '12:12',
  thedate: 2017-12-18T08:00:00.000Z, <== I think this is only supposed to be date.. I don't know why its recording the 8:00 stuff
  title: '3 min ish later',
  active: null,
  id: '2',
  updated_timestamp: 2017-12-18T20:12:43.321Z  <== this seems to be working, but I think its in the wrong timezone
}

updated

incrimenting per user
select max(alarm_id) + 1 where user_uuid = ?

*/


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
  user_uuid UUID UNIQUE REFERENCES users(user_uuid) ON DELETE CASCADE,
  card_number varchar(20) NOT NULL, -- will validate and encrypt on server lvl
  exp_month varchar(20) NOT NULL CHECK (exp_month ~ '^[\d]{2}$'),
  exp_date varchar(20) NOT NULL CHECK (exp_date ~ '^[\d]{2}$'),
  css varchar(20) NOT NULL CHECK (css ~ '^[\d]{3,4}$'),
  address_1 varchar(100) NOT NULL CHECK (address_1 ~ '^[\da-zA-Z]{1,20}$'), -- could validate server level aswell
  address_2 varchar(100) CHECK (address_2 ~ '^[\da-zA-Z]{1,20}$'),
  city varchar(20) NOT NULL CHECK (city ~ '^[\da-zA-Z]{1,20}$'),
  state varchar(20) NOT NULL CHECK (state ~ '^[A-Z]{2}'),
  zip varchar(20) NOT NULL CHECK (zip ~ '^\d{5}$')
);

CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  product_id varchar(20) UNIQUE NOT NULL CHECK (product_id ~ '([A-Z\d]{4})-([A-Z]{1})-([A-Z\d]{4})-([\d]{4})'),
  universal_id varchar(20) NOT NULL CHECK (universal_id ~ '^[\d]{12}$'),  -- could be a lot better, probably validate server lvl too
  price numeric(10,2) NOT NULL,
  name varchar(100) NOT NULL CHECK (name ~ '^[A-Za-z\d]{1,30}$'),
  description varchar(100) NOT NULL CHECK (name ~ '^[A-Za-z\d]{1,99}$'),
  size varchar(20) CHECK (size ~ '^[sml]{1}$'),
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cart (
  user_uuid UUID REFERENCES users(user_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
  product_id varchar(20) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
  total numeric(10) NOT NULL default 1, -- must be updated via select and update on server
  quantity numeric(10) NOT NULL default 1,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE price_history (
  product_id varchar(20) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
  price numeric(10,2) REFERENCES products(price) ON DELETE CASCADE ON UPDATE CASCADE, -- not unique, need another way to add information
  updated_timestamp timestamptz REFERENCES products(updated_timestamp) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (product_id, price)
);
