DROP DATABASE IF EXISTS foodfydb;
CREATE DATABASE foodfydb;

CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "title" text,
  "ingredients" text[],
  "preparation" text[],
  "information" text,
  "user_id" int,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "file_id" int,
  "password" text NOT NULL,
  "is_admin" boolean,
  "reset_token" text,
  "reset_token_expires" text,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

INSERT INTO users(name, email, password, is_admin) VALUES ('Yasmin Braga', 'yasmin@mail.com', '123456', true)

ALTER TABLE "recipes" 
ADD FOREIGN KEY ("user_id") 
REFERENCES "users" ("id");

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text
);

CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,
  "recipe_id" int,
  "file_id" int
);

ALTER TABLE "recipe_files" 
ADD FOREIGN KEY ("file_id")
REFERENCES "files" ("id")
ON DELETE CASCADE;

ALTER TABLE "recipe_files" 
ADD FOREIGN KEY ("recipe_id")
REFERENCES "recipes" ("id")
ON DELETE CASCADE;

-- create procedure
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- auto updated_at recipes
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- auto updated_at users
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");
