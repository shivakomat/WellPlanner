-- Customers Schema

# --- !Ups
CREATE TABLE "clients" ("id" SERIAL PRIMARY KEY, "name" varchar(50), "phone_number" varchar(100), "event_type" varchar(25), "event_date" numeric, "email" varchar(100), "notes" varchar(1024), "budget"  double precision,
 "status" varchar(100), "business_id" SERIAL, FOREIGN KEY("business_id") REFERENCES "businesses"(id), "modified_date" numeric, "created_date" numeric);

-- insert into "clients" (name, event_type, event_date, email, notes, budget, phone_number, status, business_id, modified_date, created_date) values ('Shiva', 'Wedding', 20210203, 'shiv@gmail.com', 'Hello world notes', 7000, 9058462433, 'New', 1, 10202020, 10202020);

# --- !Downs
DROP TABLE "clients";