create database mist;

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON user
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

create table user(
    user_id  primary varchar(255) not null unique key,
    email varchar(255) not null unique,
    password varchar(255) not null, 
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
)