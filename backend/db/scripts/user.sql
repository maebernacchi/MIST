create table user(
    user_id  primary varchar(255) not null unique key,
    email varchar(255) not null unique,
    password varchar(255) not null, 
    fullname varchar(255),
    verified boolean default 0,
    need_tutorial boolean default 1,
    admin boolean default 0,
    profile_pic varchar(255),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

);
-- work on blocked user later

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON user
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();