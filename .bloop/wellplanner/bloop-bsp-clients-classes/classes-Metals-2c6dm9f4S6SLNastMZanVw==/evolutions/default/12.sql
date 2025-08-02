# --- !Ups
CREATE TABLE "vendor_buckets" ("id" SERIAL PRIMARY KEY, "business_id" SERIAL, "bucket_name" varchar(100), "bucket_type" varchar(100), "budget_amount" NUMERIC , FOREIGN KEY("business_id") REFERENCES "businesses"(id), "modified_date" NUMERIC, "created_date" NUMERIC);


# --- !Downs
DROP TABLE "vendor_buckets";
