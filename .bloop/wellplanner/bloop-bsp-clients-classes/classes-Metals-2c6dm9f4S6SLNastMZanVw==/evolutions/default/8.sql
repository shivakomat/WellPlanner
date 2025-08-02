-- Vendor Contacts Schema

# --- !Ups
CREATE TABLE "vendor_contacts" ("id" SERIAL PRIMARY KEY, "name" varchar(50),  "description" varchar(150),  "contact" varchar(50),  "location" varchar(50), "phone_number" varchar(100), "vendor_type" varchar(25), "email" varchar(100), "notes" varchar(1024), "estimated_costs"  double precision,
 "business_id" SERIAL, FOREIGN KEY("business_id") REFERENCES "businesses"(id), "modified_date" numeric, "created_date" numeric);


-- INSERT INTO "vendor_contacts" (name, description, notes, estimated_costs, email, contact, location, phone_number, vendor_type, business_id, modified_date, created_date) values ('Livermore Golf Course', 'Wedding event place', 'hello world', 5000, '123@gmail.com', 'Shiva', 'North Livermore', '9058453243', 'hall', 1, 20092020, 20092020);


# --- !Downs
DROP TABLE "vendor_contacts";