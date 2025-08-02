-- Projects Schema

# --- !Ups
CREATE TABLE "projects" ("id" SERIAL PRIMARY KEY, "name" varchar(50), "event_type" varchar(25), "brides_name" varchar(100), "grooms_name" varchar(100), "budget" double precision, "event_date" numeric, "client_id" SERIAL, "business_id" SERIAL, FOREIGN KEY("business_id") REFERENCES "businesses"(id), FOREIGN KEY("client_id") REFERENCES "clients"(id), "modified_date" numeric, "created_date" numeric, "is_deleted" boolean);


-- insert into "projects" (id, name, event_type, brides_name, grooms_name, budget, event_date, client_id, business_id, modified_date, created_date) values (1, 'Radhika & Shiva', 'WEDDING', 'Radhika', 'Shiv', 4000, 20102020, 1, 1, 10102020, 10102020, false);

# --- !Downs
DROP TABLE "projects";