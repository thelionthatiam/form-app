CREATE TABLE alarms (
  user_uuid UUID NOT NULL REFERENCES users(user_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
  awake varchar(100) NOT NULL CHECK (awake ~ '^([01][0-9])|([2][0-3]):[0-5][0-9]$'),
  thedate date NOT NULL DEFAULT now(),
  title varchar(100) NOT NULL DEFAULT 'alarm' CHECK (title ~ '^[ 0-9a-zA-Z!@#$%^&*()_+]{1,20}$')
);
