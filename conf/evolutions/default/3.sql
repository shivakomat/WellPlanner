-- Users Schema

# --- !Ups
CREATE TABLE "users" ("id" serial PRIMARY KEY, "user_auth_0_id" varchar(100), "logged_in" boolean, "username" varchar(50), "password" varchar(100), "email" varchar(100), "business_id" integer, "is_admin" boolean, "is_customer" boolean, "is_an_employee" boolean, FOREIGN KEY("business_id") REFERENCES "businesses"(id), "modified_date" integer, "created_date" integer);


INSERT INTO users ("id", "user_auth_0_id", "logged_in", "username" , "password", "email" , "business_id" , "is_admin" , "is_customer" , "is_an_employee" , "modified_date" , "created_date" )
values (1, 'demo_auth_id', false, 'sk1989', 'demo2024', 'demo@well-planner.co', 1, true, false, false, 20201220, 20201220);

# --- !Downs
DROP TABLE "users";