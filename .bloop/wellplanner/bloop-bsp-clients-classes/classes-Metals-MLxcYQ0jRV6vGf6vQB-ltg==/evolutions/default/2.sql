# --- !Ups
-- First, let's create the businesses table if it doesn't exist (required for foreign key)
CREATE TABLE IF NOT EXISTS "businesses" (
    "id"               SERIAL PRIMARY KEY,
    "name"             varchar(100),
    "owner_profile_name" varchar(100),
    "email"            varchar(100),
    "about"            varchar(500),
    "city"             varchar(100),
    "phone_number"     varchar(100),
    "social_media_link" varchar(1024),
    "state"            varchar(100),
    "country"          varchar(100),
    "modified_date"    integer,
    "created_date"     integer
);


-- Insert a default business if it doesn't exist
INSERT INTO businesses ("id", "name", "owner_profile_name", "email", "about", "city", "phone_number", "social_media_link", "state", "country", "modified_date", "created_date")
SELECT 1,
       'Tri Valley Wedding Planners',
       NULL,               -- owner_profile_name
       'test415@gmail.com',-- email
       'N/A',               -- about
       'N/A',               -- city
       'N/A',               -- phone_number
       'N/A',               -- social_media_link
       'N/A',               -- state
       'N/A',               -- country
       20250730,           -- modified_date
       20250730            -- created_date
WHERE NOT EXISTS (SELECT 1 FROM businesses WHERE id = 1);



# --- !Downs
DROP TABLE IF EXISTS "businesses";