-- Project Tasks Schema

# --- !Ups
CREATE TABLE "tasks" ("id" SERIAL PRIMARY KEY, "title" varchar(1024), "description" varchar(1024), "notes" varchar(1024), "is_category" boolean, "is_visible_to_customer"  boolean, "due_date" timestamp,  "user_created_id" SERIAL, "business_id" SERIAL, "project_id" SERIAL,
"parent_task_id" SERIAL, FOREIGN KEY("user_created_id") REFERENCES "users"(id), FOREIGN KEY("project_id") REFERENCES "projects"(id), FOREIGN KEY("business_id") REFERENCES "businesses"(id), "modifiedDate" NUMERIC, "createdDate" NUMERIC);

# --- !Downs
DROP TABLE "tasks";