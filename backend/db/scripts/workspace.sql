create table workspaces(
    file_name varchar(255) not null,
    workspace_data varchar(255) not null,
    user_id varchar(255) not null,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
-- what type is workspace data??

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();