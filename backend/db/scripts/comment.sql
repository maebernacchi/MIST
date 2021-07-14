create table comments(
    comment_id varchar(255) not null serial primary key,
    contents text not null,
    user_id varchar(255) not null foreign key,
    post_id varchar(255) not null foreign key,
    parent_comment varchar(255),
    likes int default 0,

    publish_date timestamptz not null default now()
);

--parent_comment: used for replies to other comments. if null, the comment is not a reply