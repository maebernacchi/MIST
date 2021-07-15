create table reports(
    reported_user varchar(255) not null,
    report_description varchar(255) not null,

    last_flagged_at timestamptz not null default now()
);