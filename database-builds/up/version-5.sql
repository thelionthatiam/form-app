ALTER TABLE payment_credit ADD COLUMN card_uuid UUID UNIQUE NOT NULL default uuid_generate_v4();
ALTER TABLE payment_credit DROP COLUMN active;

ALTER TABLE user_settings ADD COLUMN active_payment UUID REFERENCES payment_credit(card_uuid);

CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  trans_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  user_uuid UUID NOT NULL REFERENCES users(user_uuid),
  recipient UUID NOT NULL REFERENCES orgs(org_uuid),
  payment_uuid UUID NOT NULL REFERENCES payment_credit(card_uuid),
  snoozes numeric(10,2) NOT NULL,
  dismisses numeric(10,2) NOT NULL,
  wakes numeric(10,2) NOT NULL,
  total numeric(10,2) NOT NULL,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER transactions_update_timestamp
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE org_transactions (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  trans_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  user_uuid UUID NOT NULL REFERENCES users(user_uuid),
  recipient UUID NOT NULL REFERENCES orgs(org_uuid),
  org_trans_total numeric(10,2) NOT NULL,
  sent boolean NOT NULL default false,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER org_transactions_update_timestamp
  BEFORE UPDATE ON org_transactions
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE revenue (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  trans_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  user_uuid UUID NOT NULL REFERENCES users(user_uuid),
  trans_revenue_total numeric(10,2) NOT NULL,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER revenue_update_timestamp
  BEFORE UPDATE ON revenue
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

ALTER TABLE alarms ADD COLUMN triggered boolean default FALSE;

-- reset transaction db changes
DELETE FROM org_transactions;
DELETE FROM revenue;
DELETE FROM transactions;
UPDATE snoozes SET paid = false;
UPDATE dismisses SET paid = false;
UPDATE wakes SET paid = false;
