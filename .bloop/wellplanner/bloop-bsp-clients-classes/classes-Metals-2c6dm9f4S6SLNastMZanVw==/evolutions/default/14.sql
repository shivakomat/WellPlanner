# --- !Ups
CREATE TABLE "vendor_manage" ("id" SERIAL PRIMARY KEY, "business_id" SERIAL, "project_id" SERIAL, "vendor_contact_id" SERIAL,
FOREIGN KEY("project_id") REFERENCES "projects"(id), FOREIGN KEY("business_id") REFERENCES "businesses"(id),  FOREIGN KEY("vendor_contact_id") REFERENCES "vendor_contacts"(id),
"modified_date" NUMERIC, "created_date" NUMERIC);

CREATE TABLE "vendor_categories" ("id" SERIAL PRIMARY KEY, "business_id" SERIAL, "project_id" SERIAL, "name" varchar(100), FOREIGN KEY("project_id") REFERENCES "projects"(id), FOREIGN KEY("business_id") REFERENCES "businesses"(id),
"modified_date" NUMERIC, "created_date" NUMERIC);

CREATE TABLE "vendor_manage_categories" ("id" SERIAL PRIMARY KEY, "vendor_manage_id" SERIAL, "business_id" SERIAL, "project_id" SERIAL,
FOREIGN KEY("project_id") REFERENCES "projects"(id), FOREIGN KEY("business_id") REFERENCES "businesses"(id),  FOREIGN KEY("vendor_manage_id") REFERENCES "vendor_manage"(id), "modified_date" NUMERIC, "created_date" NUMERIC);


CREATE TABLE "timeline_items" ("id" SERIAL PRIMARY KEY, "business_id" SERIAL, "project_id" SERIAL, "parent_id" NUMERIC, "duration" NUMERIC, "description" VARCHAR(200), "time" VARCHAR(10), "date" NUMERIC, "contact" VARCHAR(100),
"notes" VARCHAR(1000), "category" VARCHAR(100), "is_completed" boolean,
FOREIGN KEY("project_id") REFERENCES "projects"(id), FOREIGN KEY("business_id") REFERENCES "businesses"(id),  "modified_date" NUMERIC, "created_date" NUMERIC);

# --- !Downs
DROP TABLE "vendor_manage_categories";
DROP TABLE "vendor_categories";
DROP TABLE "vendor_manage";
DROP TABLE "timeline_items";
