--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.4
-- Dumped by pg_dump version 9.6.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: nonce; Type: TABLE; Schema: public; Owner: juliantheberge
--

CREATE TABLE nonce (
    user_uuid uuid,
    nonce character varying(100),
    thetime timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE nonce OWNER TO juliantheberge;

--
-- Name: users; Type: TABLE; Schema: public; Owner: juliantheberge
--

CREATE TABLE users (
    id bigint NOT NULL,
    user_uuid uuid DEFAULT uuid_generate_v4() NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(20) NOT NULL,
    password character varying(100) NOT NULL,
    CONSTRAINT users_email_check CHECK (((email)::text ~ '^[A-Za-z0-9\._\$%\-]+@[A-Za-z0-9\-]+.[A-Za-z0-9]{2,6}$'::text)),
    CONSTRAINT users_phone_check CHECK (((phone)::text ~ '^[0-9]+$'::text))
);


ALTER TABLE users OWNER TO juliantheberge;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: juliantheberge
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO juliantheberge;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: juliantheberge
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: juliantheberge
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: nonce; Type: TABLE DATA; Schema: public; Owner: juliantheberge
--

COPY nonce (user_uuid, nonce, thetime) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: juliantheberge
--

COPY users (id, user_uuid, email, phone, password) FROM stdin;
2	06fc7d24-9d88-43a3-9be2-ea88942966a3	a@a.aa	1	aaaAA11$$
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: juliantheberge
--

SELECT pg_catalog.setval('users_id_seq', 2, true);


--
-- Name: nonce nonce_user_uuid_key; Type: CONSTRAINT; Schema: public; Owner: juliantheberge
--

ALTER TABLE ONLY nonce
    ADD CONSTRAINT nonce_user_uuid_key UNIQUE (user_uuid);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: juliantheberge
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: juliantheberge
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_user_uuid_key; Type: CONSTRAINT; Schema: public; Owner: juliantheberge
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_user_uuid_key UNIQUE (user_uuid);


--
-- Name: nonce nonce_user_uuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: juliantheberge
--

ALTER TABLE ONLY nonce
    ADD CONSTRAINT nonce_user_uuid_fkey FOREIGN KEY (user_uuid) REFERENCES users(user_uuid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

