-- Users Schema
-- Updated Users Schema for Secure Authentication
-- This evolution adds password_salt field and creates sample users with hashed passwords

# --- !Ups
-- Create the users table with password_salt field
CREATE TABLE IF NOT EXISTS "users" (
    "id" serial PRIMARY KEY,
    "user_auth_0_id" varchar(100) DEFAULT '',
    "logged_in" boolean DEFAULT false,
    "username" varchar(50) UNIQUE NOT NULL,
    "password" varchar(255) NOT NULL,
    "password_salt" varchar(255) DEFAULT '',
    "email" varchar(100) UNIQUE NOT NULL,
    "business_id" integer DEFAULT 1,
    "is_admin" boolean DEFAULT false,
    "is_customer" boolean DEFAULT false,
    "is_an_employee" boolean DEFAULT false,
    "modified_date" integer,
    "created_date" integer,
    FOREIGN KEY("business_id") REFERENCES "businesses"(id)
);

-- Insert a sample admin user for testing if it doesn't already exist
INSERT INTO users ("user_auth_0_id", "logged_in", "username", "password", "password_salt", "email", "business_id", "is_admin", "is_customer", "is_an_employee", "modified_date", "created_date")
SELECT '', false, 'test415@gmail.com', 'e9c0b3d233efaab54c9fe7b072a4c2e132d343b3f1e3e105a549ad419acf0cfb', 'randomsalt', 'test415@gmail.com', 1, true, false, false, 20250730, 20250730
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'test415@gmail.com');

# --- !Downs
DROP TABLE IF EXISTS "users";
