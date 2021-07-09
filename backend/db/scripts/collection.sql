create table collections(
    collection_id varchar(255) not null,
    contents varchar(255) not null,
    user_id varchar(255) not null,
    likes int default 0,

    publish_date timestamptz not null default now()
);

--parent_comment: used for replies to other comments. if null, the comment is not a reply