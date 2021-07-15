create table blocked_users(
    user_id varchar(255) not null foreign key,
    blocked_user_id varchar(255) not null
);