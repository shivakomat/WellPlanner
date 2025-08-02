# --- !Ups
CREATE TABLE "teams" ("id" SERIAL PRIMARY KEY, "business_id" SERIAL, "member_name" varchar(100), "email" varchar(100), FOREIGN KEY("business_id") REFERENCES "businesses"(id), "modified_date" NUMERIC, "created_date" NUMERIC);


# --- !Downs
DROP TABLE "teams";
