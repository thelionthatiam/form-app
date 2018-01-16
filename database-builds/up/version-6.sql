ALTER TABLE products ADD COLUMN image varchar(100);


CREATE TABLE  coupons (
  id BIGSERIAL PRIMARY KEY,
  order_uuid UUID NOT NULL REFERENCES orders(order_uuid),
  coupon_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  rule varchar(100),
  create_timestamp timestamptz NOT NULl DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER coupons_update_timestamp
  BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();


CREATE TABLE order_coupons (
  id BIGSERIAL PRIMARY KEY,
  order_uuid UUID REFERENCES orders(order_uuid),
  coupon_uuid UUID REFERENCES coupons(coupon_uuid),
  order_coupon_uuid UUID NOT NULL default uuid_generate_v4(),
  discount varchar(100),
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER order_coupons_update_timestamp
  BEFORE UPDATE ON order_coupons
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();
