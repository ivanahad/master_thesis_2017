DROP DATABASE IF EXISTS ipfix;
CREATE DATABASE ipfix;

\c ipfix;

CREATE TABLE logs (
  ID SERIAL PRIMARY KEY,
  domain_id integer CHECK (domain_id > 0) NOT NULL,
  export_time timestamp NOT NULL,
  seq_no integer CHECK (seq_no > 0) NOT NULL,
  data json NOT NULL,
  UNIQUE(domain_id, export_time)
)
