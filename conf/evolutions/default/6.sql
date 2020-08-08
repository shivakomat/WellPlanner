-- Project Tasks Schema

# --- !Ups
CREATE TABLE "tasks" ("id" SERIAL PRIMARY KEY, "title" varchar(1024), "description" varchar(1024), "notes" varchar(1024), "is_category" boolean, "is_completed" boolean, "is_visible_to_customer"  boolean, "due_date" NUMERIC, "business_id" SERIAL, "project_id" SERIAL,
"parent_task_id" NUMERIC, FOREIGN KEY("project_id") REFERENCES "projects"(id), FOREIGN KEY("business_id") REFERENCES "businesses"(id), "modified_date" NUMERIC, "created_date" NUMERIC);

# --- !Downs
DROP TABLE "tasks";