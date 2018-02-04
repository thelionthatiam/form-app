CREATE TABLE user_settings (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  user_uuid UUID NOT NULL UNIQUE REFERENCES users(user_uuid),
  payment_scheme varchar(50) NOT NULL CHECK (payment_scheme ~ '^[A-Za-z\d ]{1,30}$'),
  snooze_price numeric(10,2) NOT NULL default 1.00,
  dismiss_price numeric(10,2) NOT NULL default 3.00,
  month_max numeric(10,2) NOT NULL default 20.00,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER user_settings_update_timestamp
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE orgs (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  org_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  org_sku varchar(20) UNIQUE NOT NULL CHECK (org_sku ~ '([A-Z\d]{4})-([A-Z]{1})-([A-Z\d]{4})-([\d]{4})'),
  name varchar(100) NOT NULL UNIQUE CHECK (name ~ '^[A-Za-z\d ]{1,30}$'),
  description varchar(100) NOT NULL CHECK (description ~ '^[A-Za-z\d ]{1,99}$'),
  cause varchar(50) NOT NULL CHECK (cause ~ '^[A-Za-z\d ]{1,30}$'),
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER orgs_update_timestamp
  BEFORE UPDATE ON orgs
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE user_orgs (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  user_uuid UUID NOT NULL REFERENCES users(user_uuid),
  org_uuid UUID NOT NULL REFERENCES orgs(org_uuid),
  active boolean default FALSE,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER user_orgs_timestamp
  BEFORE UPDATE ON user_orgs
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();
