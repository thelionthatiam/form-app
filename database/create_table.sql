--create table

CREATE TABLE users (
	email varchar(20)        UNIQUE NOT NULL CHECK (email ~ '^[A-Za-z0-9\._\$%\-]+@[A-Za-z0-9\-]+.[A-Za-z0-9]{2,6}$'),
	phone varchar(20) 	     UNIQUE NOT NULL CHECK (phone ~ '^[0-9]+$'),
	password varchar(20)     NOt NUll
);


--test table, no constraints

CREATE TABLE users (
	email varchar(20),
	phone varchar(20),
	password varchar(20)
);
