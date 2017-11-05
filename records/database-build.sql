--this is a pseudo script stating all the commands in order HARDCODED

root$ sudo -u juliantheberge psql postgres

psql# CREATE DATABASE formapp;

psql# GRANT ALL PRIVILEGES ON DTABASE formapp TO juliantheberge;
psql# \connect formapp
formapp# CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
formapp# CREATE TABLE users (
formapp# 	id BIGSERIAL PRIMARY KEY NOT NULL,
formapp# 	user_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
formapp# 	email varchar(100) UNIQUE NOT NULL CHECK (email ~ '^[A-Za-z0-9\._\$%\-]+@[A-Za-z0-9\-]+.[A-Za-z0-9]{2,6}$'),
formapp# 	phone varchar(20) NOT NULL CHECK (phone ~ '^[0-9]+$'),
formapp# 	password varchar(100) NOT NUll
formapp# );
formapp# CREATE TABLE nonce (
formapp#   user_uuid UUID UNIQUE REFERENCES users(user_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
formapp#   nonce varchar(100),
formapp#   theTime timestamptz NOT NULL DEFAULT now()
formapp# );
formapp# \dt --check if the tables are there and functioning
