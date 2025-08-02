# --- !Ups
CREATE TABLE "client_accesses" ("id" SERIAL PRIMARY KEY, "business_id" SERIAL, "project_id" SERIAL,
                                "logged_in" boolean, "username" varchar(50), "password" varchar(100), "email" varchar(100),
                                FOREIGN KEY("project_id") REFERENCES "projects"(id), FOREIGN KEY("business_id") REFERENCES "businesses"(id),
                                "modified_date" NUMERIC, "created_date" NUMERIC);


# --- !Downs
drop table "client_accesses";