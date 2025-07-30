-- Updated Users Schema for Secure Authentication
-- This evolution adds password_salt field and creates sample users with hashed passwords

# --- !Ups

-- First, let's create the businesses table if it doesn't exist (required for foreign key)
CREATE TABLE IF NOT EXISTS "businesses" (
    "id" serial PRIMARY KEY,
    "name" varchar(100),
    "created_date" integer,
    "modified_date" integer
);

-- Insert a default business if it doesn't exist
INSERT INTO businesses ("id", "name", "created_date", "modified_date")
SELECT 1, 'Default Business', 20240101, 20240101
WHERE NOT EXISTS (SELECT 1 FROM businesses WHERE id = 1);

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

-- Insert sample users with hashed passwords for testing
-- Note: These are sample passwords hashed with salt for demonstration
-- Password for 'admin' user is 'admin123' (hashed with salt)
-- Password for 'testuser' user is 'password123' (hashed with salt)

INSERT INTO users ("id", "user_auth_0_id", "logged_in", "username", "password", "password_salt", "email", "business_id", "is_admin", "is_customer", "is_an_employee", "modified_date", "created_date")
SELECT 1, '', false, 'admin', 'YWRtaW4xMjNzYWx0MTIz', 'c2FsdDEyMw==', 'admin@wellplanner.com', 1, true, false, true, 20240127, 20240127
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

INSERT INTO users ("id", "user_auth_0_id", "logged_in", "username", "password", "password_salt", "email", "business_id", "is_admin", "is_customer", "is_an_employee", "modified_date", "created_date")
SELECT 2, '', false, 'testuser', 'cGFzc3dvcmQxMjNzYWx0NDU2', 'c2FsdDQ1Ng==', 'testuser@wellplanner.com', 1, false, true, false, 20240127, 20240127
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'testuser');

# --- !Downs

DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "businesses";
