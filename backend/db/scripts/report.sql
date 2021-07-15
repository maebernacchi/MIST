create table reports(
    reported_user_id varchar(255) not null references users(user_id),
    report_description varchar(255) not null,

    created_at timestamptz not null default now()
);