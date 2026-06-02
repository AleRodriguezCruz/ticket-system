-- CreateTable
CREATE TABLE "KnowledgeArticle" (
    "id"         SERIAL PRIMARY KEY,
    "ticketId"   INTEGER NOT NULL UNIQUE,
    "title"      TEXT NOT NULL,
    "problem"    TEXT NOT NULL,
    "solution"   TEXT NOT NULL,
    "category"   TEXT NOT NULL,
    "tags"       TEXT[] DEFAULT ARRAY[]::TEXT[],
    "views"      INTEGER NOT NULL DEFAULT 0,
    "helpful"    INTEGER NOT NULL DEFAULT 0,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorName" TEXT NOT NULL,
    FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE
);
