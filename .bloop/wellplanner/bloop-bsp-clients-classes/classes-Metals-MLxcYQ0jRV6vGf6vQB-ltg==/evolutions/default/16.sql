# --- !Ups
CREATE TABLE "client_documents" (
  "id"            SERIAL PRIMARY KEY,
  "client_id"      INTEGER NOT NULL,
  "filename"       VARCHAR(255) NOT NULL,
  "mime_type"      VARCHAR(100) NOT NULL,
  "file_size"      BIGINT NOT NULL,
  "file_path"      VARCHAR(500) NOT NULL,
  "uploaded_at"    NUMERIC,
  FOREIGN KEY("client_id") REFERENCES "clients"(id) ON DELETE CASCADE
);

# --- !Downs
DROP TABLE "client_documents";
