--create table
--remember to run CRAETE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
	id BIGSERIAL PRIMARY KEY NOT NULL,
	user_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
	email varchar(100) UNIQUE NOT NULL CHECK (email ~ '^[A-Za-z0-9\._\$%\-]+@[A-Za-z0-9\-]+.[A-Za-z0-9]{2,6}$'),
	phone varchar(20) NOT NULL CHECK (phone ~ '^[0-9]+$'),
	password varchar(100) NOT NUll CHECK (password ~ '^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$')
);

--test table, no constraints

CREATE TABLE users (
	email varchar(20),
	phone varchar(20),
	password varchar(20)
);
