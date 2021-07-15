create table collections-images(
    post_id varchar(255) not null foreign key,
    collection_id varchar(255) not null foreign key
);

-- this table is meant to connect the posts and collections tables, by linking post ids to collection ids
-- when posts from a certain collection are retrieved, all the post ids with a certain collection id are retrieved