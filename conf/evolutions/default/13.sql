# --- !Ups
CREATE TABLE "vendor_contacts_lists" ("id" SERIAL PRIMARY KEY, "business_id" SERIAL, "vendor_bucket_id" SERIAL, "vendor_contact_id" SERIAL, FOREIGN KEY("business_id") REFERENCES "businesses"(id),  FOREIGN KEY("vendor_bucket_id") REFERENCES "vendor_buckets"(id),  FOREIGN KEY("vendor_contact_id") REFERENCES "vendor_contacts"(id), "modified_date" NUMERIC, "created_date" NUMERIC);


# --- !Downs
DROP TABLE "vendor_contacts_lists";
