CREATE TABLE user_settings (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  user_uuid UUID NOT NULL UNIQUE REFERENCES users(user_uuid),
  payment_scheme varchar(50) NOT NULL default 'classic' CHECK (payment_scheme ~ '^[A-Za-z\d ]{1,30}$'),
  snooze_price numeric(10,2) NOT NULL default .50,
  dismiss_price numeric(10,2) NOT NULL default 3.00,
  month_max numeric(10,2) NOT NULL default 20.00,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER user_settings_update_timestamp
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();



-- DUMMY ORGS
INSERT INTO orgs (org_sku, name, description, cause) VALUES ('UNIC-L-INTD-8168', 'United Nations Childrens Fund', 'UNICEF works in 190 countries and territories to save children’s lives, to defend their rights, and to help them fulfil their potential. And we never give up. UNICEF for every child.', 'international relief and development');
INSERT INTO orgs (org_sku, name, description, cause) VALUES ('MOMA-M-LIT0-6485', 'Museum of Modern Art',
  'At The Museum of Modern Art and MoMA PS1, we celebrate creativity, openness, tolerance, and generosity. We aim to be inclusive places—both onsite and online—where diverse cultural, artistic, social, and political positions are welcome. We’re committed to sharing the most thought-provoking modern and contemporary art, and hope you will join us in exploring the art, ideas, and issues of our time.',
  'literacy');
INSERT INTO orgs (org_sku, name, description, cause) VALUES ('RNC0-M-POL0-8645', 'Republican National Committee', 'We believe that our: Country is exceptional, Constitution should be honored, valued, and upheld, Leaders should serve people, not special interests, Families and communities should be strong and free from government intrusion, Institution of traditional marriage is the foundation of society, Government should be smaller, smarter and more efficient, Health care decisions should be made by us and our doctors, Paychecks should not be wasted on poorly run government programs and more...', 'literacy');



CREATE TABLE orgs (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  org_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  org_sku varchar(20) UNIQUE NOT NULL CHECK (org_sku ~ '([A-Z\d]{4})-([A-Z]{1})-([A-Z\d]{4})-([\d]{4})'),
  name varchar(100) NOT NULL UNIQUE CHECK (name ~ '^[A-Za-z\d ]{1,30}$'),
  description varchar(100) NOT NULL CHECK (description ~ '^[A-Za-z\d ]{1,99}$'),
  cause varchar(50) NOT NULL CHECK (cause ~ '^[A-Za-z\d ]{1,30}$'),
  link varchar(100) NOT NULL default 'https://www.google.com',
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
