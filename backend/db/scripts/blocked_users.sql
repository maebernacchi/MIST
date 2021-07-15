create table blocked_users(
    user_id integer not null references users(user_id),
    blocked_user_id varchar(255) not null
);