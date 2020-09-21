-- Business Schema
# --- !Ups
CREATE TABLE "businesses" ("id" SERIAL PRIMARY KEY, "name" varchar(100), "owner_profile_name" varchar(100), "email" varchar(100), "about" varchar(500), "city" varchar(100), "phone_number" varchar(100), "state" varchar(100), "country" varchar(100), "modified_date" integer, "created_date" integer);

insert into businesses (name, owner_profile_name, email, about, city, phone_number, state, country, modified_date, created_date) values ('Pleasanton Wedding Planners', 'Carl Ageson', 'pleasantonplanners@gmail.com', 'One on and only place in minneapolis', 'Plesanton', 94588 ,'CA','USA',20200610, 20200610);

# --- !Downs
DROP TABLE "businesses";