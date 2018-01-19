-- dummy coupons
INSERT INTO coupons (discount, name, description, expires_on) VALUES (0.20, '20% off order', 'Take 20% off the total of your order before tax', '02/01/18');
INSERT INTO coupons (discount, name, description, expires_on, applies_to) VALUES (0.50, '50% off NRA', 'Take 50% off the all the NRAs you buy', '02/01/18', 'NRA0-S-GUNS-4233');
INSERT INTO cart_coupons(cart_uuid, coupon_uuid) VALUES ('530e03ed-28be-47c1-a774-cff6486f0606', 'f014c042-b6d4-40b6-afe8-348c16ee8a4d');

SELECT c.coupon_uuid, name, expires_on, description, discount, applied, used FROM coupons c INNER JOIN cart_coupons cc ON c.coupon_uuid = cc.coupon_uuid AND (cart_uuid = '97d27645-b6f7-40e1-84a8-b5cd9f3497f5') AND (used = false);



ALTER TABLE products ADD COLUMN image varchar(100);
ALTER TABLE cart_items ADD COLUMN discount numeric(10,2) NOT NULL default 0.00;
ALTER TABLE order_items ADD COLUMN discount numeric(10,2) NOT NULL default 0.00;


CREATE TABLE  coupons (
  id BIGSERIAL PRIMARY KEY,
  coupon_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  name varchar(100) UNIQUE NOT NULL,
  description  varchar(100),
  discount numeric(10,2) NOT NULL,
  expires_on timestamptz, -- how to insert timestamp?
  applies_to varchar(100) NOT NULL DEFAULT 'order',
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER coupons_update_timestamp
  BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE cart_coupons (
  id BIGSERIAL PRIMARY KEY,
  cart_uuid UUID REFERENCES cart(cart_uuid),
  coupon_uuid UUID REFERENCES coupons(coupon_uuid),
  used BOOLEAN default false,
  applied BOOLEAN default false,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER cart_coupons_update_timestamp
  BEFORE UPDATE ON cart_coupons
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();
