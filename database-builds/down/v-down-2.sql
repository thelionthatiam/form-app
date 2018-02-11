ALTER TABLE users DROP COLUMN permission;
DROP TABLE permission CASCADE;
DROP TABLE coupons CASCADE;
DROP TABLE cart_coupons CASCADE;
ALTER TABLE order_items DROP COLUMN discount;
ALTER TABLE cart_itmes DROP COLUMN discount;
ALTER TABLE products DROP COLUMN image;
