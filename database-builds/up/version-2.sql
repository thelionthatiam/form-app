ALTER TABLE users ADD COLUMN name varchar(100) CHECK(name ~ '^([a-zA-Z]{1,15})( [a-zA-Z]{1,15})?([ -]?[a-zA-Z]{1,15})?$');
