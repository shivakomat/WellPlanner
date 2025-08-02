-- Budget Breakdowns Schema

# --- !Ups
CREATE TABLE "budget_breakdowns" ("id" SERIAL PRIMARY KEY, "title" varchar(1024), "is_budget_header" boolean,  "business_id" SERIAL, "project_id" SERIAL, "estimate" NUMERIC, "actual" NUMERIC,
"parent_budget_id" NUMERIC,  FOREIGN KEY("project_id") REFERENCES "projects"(id), FOREIGN KEY("business_id") REFERENCES "businesses"(id), "modified_date" NUMERIC, "created_date" NUMERIC);


CREATE TABLE "payments" ("id" SERIAL PRIMARY KEY, "budget_id" SERIAL, "payment_amount" NUMERIC,
                                "payment_date" NUMERIC,  "business_id" SERIAL, "project_id" SERIAL, "modified_date" NUMERIC,
                                 "created_date" NUMERIC, FOREIGN KEY("project_id") REFERENCES "projects"(id),
                                 FOREIGN KEY("business_id") REFERENCES "businesses"(id));

# --- !Downs
DROP TABLE "payments";
DROP TABLE "budget_breakdowns";