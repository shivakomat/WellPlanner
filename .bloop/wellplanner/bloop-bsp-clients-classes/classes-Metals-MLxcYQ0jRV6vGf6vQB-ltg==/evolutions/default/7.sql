-- Project Task Comments Schema

# --- !Ups
CREATE TABLE "task_comments" ("id" SERIAL PRIMARY KEY, "comment_text" varchar(1024), "user_created_id" SERIAL, "task_id" SERIAL, "business_id" SERIAL, "project_id" SERIAL, FOREIGN KEY("task_id") REFERENCES "tasks"(id), FOREIGN KEY("user_created_id") REFERENCES "users"(id), FOREIGN KEY("project_id") REFERENCES "projects"(id), FOREIGN KEY("business_id") REFERENCES "businesses"(id), "modified_date" NUMERIC, "created_date" NUMERIC);

# --- !Downs
DROP TABLE "task_comments";