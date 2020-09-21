-- Project Tasks Schema

# --- !Ups
CREATE TABLE "tasks" ("id" SERIAL PRIMARY KEY, "title" varchar(1024), "description" varchar(1024), "notes" varchar(1024), "is_category" boolean, "is_completed" boolean, "is_visible_to_customer"  boolean, "due_date" NUMERIC, "business_id" SERIAL, "project_id" SERIAL,
"parent_task_id" NUMERIC, FOREIGN KEY("project_id") REFERENCES "projects"(id), FOREIGN KEY("business_id") REFERENCES "businesses"(id), "modified_date" NUMERIC, "created_date" NUMERIC);

INSERT INTO tasks (title, description, notes, is_category, is_completed, is_visible_to_customer, due_date, parent_task_id, project_id, business_id, modified_date, created_date) values ('Wedding List', '', 'hello world', true, false, false, 20122020, null, 1, 1, 20092020, 20092020);

INSERT INTO tasks (title, description, notes, is_category, is_completed, is_visible_to_customer, due_date, parent_task_id, project_id, business_id, modified_date, created_date) values ('', 'Wedding Event Hall', 'Its a great place!!', true, false, false, 20122020, 1, 1, 1, 20092020, 20092020);


# --- !Downs
DROP TABLE "tasks";