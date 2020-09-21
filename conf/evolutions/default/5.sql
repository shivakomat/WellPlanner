-- Projects Schema

# --- !Ups
CREATE TABLE "projects" ("id" SERIAL PRIMARY KEY, "name" varchar(50), "event_type" varchar(25), "brides_name" varchar(100), "grooms_name" varchar(100), "budget" double precision, "event_date" numeric, "business_id" SERIAL, FOREIGN KEY("business_id") REFERENCES "businesses"(id), "modified_date" numeric, "created_date" numeric);


insert into "projects" (name, event_type, brides_name, grooms_name, budget, event_date, business_id, modified_date, created_date) values ('Radhika Apte & Shiv', 'WEDDING', 'Radhika Apte', 'Shiv', 4000, 20102020, 1, 10102020, 10102020)

# --- !Downs
DROP TABLE "projects";