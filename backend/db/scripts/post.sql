create table posts(
    post_id varchar(255) not null unique primary key,
    title varchar(255) not null,
    caption varchar(255),
    code varchar(255) not null,
    user_id varchar(255) not null,
    public boolean default false,
    likes int default 0,

    created_at timestamptz not null default now()
);
-- work on comments/featured?

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();