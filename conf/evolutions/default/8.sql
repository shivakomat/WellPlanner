-- Vendor Contacts Schema

# --- !Ups
CREATE TABLE "vendor_contacts" ("id" SERIAL PRIMARY KEY, "name" varchar(50),  "description" varchar(150),  "contact" varchar(50),  "location" varchar(50), "phone_number" varchar(100), "vendor_type" varchar(25), "email" varchar(100), "notes" varchar(1024), "estimated_costs"  double precision,
 "business_id" SERIAL, FOREIGN KEY("business_id") REFERENCES "businesses"(id), "modified_date" numeric, "created_date" numeric);

# --- !Downs
DROP TABLE "vendor_contacts";