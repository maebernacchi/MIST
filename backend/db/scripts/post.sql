create table posts(
    post_id varchar(255) not null serial primary key,
    title varchar(255) not null,
    caption varchar(255),
    code varchar(255) not null,
    user_id varchar(255) not null,
    public boolean not null,
    likes int default 0,

    created_at timestamptz not null default now()
);
-- work on featured?
