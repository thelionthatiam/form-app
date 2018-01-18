-- INSERT INTO users (email, phone, password) VALUES ('a@a.aa', '1', 'a');
--
-- INSERT INTO payment_credit (card_number, name, exp_month, exp_date, cvv, address_1, city, state, zip) VALUES ('4539 9626 3821 7151', 'JOE', '12', '12', '123', '1234', 'BLAH', 'WA', '12345');
-- INSERT INTO cart (user_uuid, card_number) VALUES ('ce1ab5fb-897c-43ad-b6a5-4318b830eb4c', '4539 9626 3821 7151' );
-- INSERT INTO products (product_id, universal_id, price, name, description, size) VALUES ('AAAA-A-AAAA-1111', '123412341234', 1, 'one', 'the one', 's');
-- INSERT INTO products (product_id, universal_id, price, name, description, size) VALUES ('BBBB-B-BBBB-2222', '123412341234', 2, 'two', 'the two', 'm');
-- INSERT INTO products (product_id, universal_id, price, name, description, size) VALUES ('CCCC-C-CCCC-1111', '123412341234', 3, 'three', 'the three', 'l');
-- INSERT INTO cart_items (cart_uuid, product_id) VALUES ('d59ec67c-13a7-4577-8074-8d63280e1a56', 'AAAA-A-AAAA-1111'), ('d59ec67c-13a7-4577-8074-8d63280e1a56', 'BBBB-B-BBBB-2222');

-- temp user_uuid ce1ab5fb-897c-43ad-b6a5-4318b830eb4c
-- temp cart_uuid d59ec67c-13a7-4577-8074-8d63280e1a56

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

CLTER TABLE nonce RENAME theTime TO created_timestamp;

ALTER TABLE alarms RENAME thedate TO created_timestamp;
ALTER TABLE alarms ADD COLUMN id BIGSERIAL PRIMARY KEY NOT NULL;
ALTER TABLE alarms ADD COLUMN alarm_uuid UUID UNIQUE NOT NULL default uuid_generate_v4();
ALTER TABLE alarms ADD COLUMN alarm_id numeric default 1; -- must be updated via select and update on server
ALTER TABLE alarms ADD COLUMN updated_timestamp timestamptz NOT NULL DEFAULT now();
CREATE TRIGGER alarms_on_update_timestamp
  BEFORE UPDATE ON alarms
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TRIGGER payment_credit_update_timestamp
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();


-- Master Card, Visa, Discover, American Express
CREATE TABLE payment_credit (
  user_uuid UUID REFERENCES users(user_uuid) ON DELETE CASCADE,
  card_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
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
  active boolean default TRUE,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER products_update_timestamp
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  product_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  product_id varchar(20) UNIQUE NOT NULL CHECK (product_id ~ '([A-Z\d]{4})-([A-Z]{1})-([A-Z\d]{4})-([\d]{4})'),
  universal_id varchar(20) NOT NULL CHECK (universal_id ~ '^[\d]{12}$'),  -- could be a lot better, probably validate server lvl too
  price numeric(10,2) NOT NULL,
  name varchar(100) NOT NULL UNIQUE CHECK (name ~ '^[A-Za-z\d ]{1,30}$'),
  description varchar(100) NOT NULL CHECK (name ~ '^[A-Za-z\d ]{1,99}$'),
  size varchar(20) NOT NULL CHECK (size ~ '^[sml]{1}$'),
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, updated_timestamp)
);

-- this needs help, its not running at all
CREATE TABLE product_history (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  product_history_id UUID UNIQUE default uuid_generate_v4(),
  product_id varchar(20) NOT NULL CHECK (product_id ~ '([A-Z\d]{4})-([A-Z]{1})-([A-Z\d]{4})-([\d]{4})'),
  universal_id varchar(20) NOT NULL CHECK (universal_id ~ '^[\d]{12}$'),  -- could be a lot better, probably validate server lvl too
  price numeric(10,2) NOT NULL,
  name varchar(100) NOT NULL CHECK (name ~ '^[A-Za-z\d ]{1,30}$'),
  description varchar(100) NOT NULL CHECK (name ~ '^[A-Za-z\d ]{1,99}$'),
  size varchar(20) NOT NULL CHECK (size ~ '^[sml]{1}$'),
  updated_timestamp timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, updated_timestamp)
);

CREATE OR REPLACE FUNCTION function_copy() RETURNS TRIGGER AS
$BODY$
BEGIN
    INSERT INTO
        product_history(product_id, universal_id, updated_timestamp, price, name, description, size)
        VALUES(new.product_id,new.universal_id, new.updated_timestamp, new.price, new.name, new.description, new.size);
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


CREATE TABLE cart (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  user_uuid UUID REFERENCES users(user_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
  cart_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  card_number varchar(20) REFERENCES payment_credit(card_number),
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER cart_items_update_timestamp
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE cart_items (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  cart_uuid UUID REFERENCES cart(cart_uuid),
  cart_item_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  product_id varchar(20) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
  quantity numeric(10) NOT NULL default 1,
  product_history_id UUID REFERENCE product_history(product_history_id);
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);


CREATE TRIGGER orders_update_timestamp
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  user_uuid UUID references users(user_uuid),
  order_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  card_number varchar(20) REFERENCES payment_credit(card_number),
  order_number numeric(10) NOT NULL default 1,
  UNIQUE (cart_uuid, order_number),
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER order_items_update_timestamp
  BEFORE UPDATE ON order
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  order_uuid UUID REFERENCES orders(order_uuid),
  order_item_uuid UUID NOT NULL default uuid_generate_v4(),
  product_id varchar(20) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
  quantity numeric(10) NOT NULL default 1,
  item_number numeric(10) NOT NULL default 1,
  product_history_id UUID default uuid_generate_v4(),
  UNIQUE (order_uuid, item_number),
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER cart_update_timestamp
  BEFORE UPDATE ON cart
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE session (
  user_uuid UUID REFERENCES users(user_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
  sessionID varchar(100) NOT NULL UNIQUE,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);
