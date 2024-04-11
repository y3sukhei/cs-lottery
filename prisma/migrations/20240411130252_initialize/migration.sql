/*
  Warnings:

  - You are about to drop the column `giftId` on the `Participant` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Gift" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "participantId" INTEGER,
    CONSTRAINT "Gift_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Gift" ("description", "id", "img", "name") SELECT "description", "id", "img", "name" FROM "Gift";
DROP TABLE "Gift";
ALTER TABLE "new_Gift" RENAME TO "Gift";
CREATE UNIQUE INDEX "Gift_participantId_key" ON "Gift"("participantId");
CREATE TABLE "new_Participant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tickedId" TEXT NOT NULL
);
INSERT INTO "new_Participant" ("id", "tickedId") SELECT "id", "tickedId" FROM "Participant";
DROP TABLE "Participant";
ALTER TABLE "new_Participant" RENAME TO "Participant";
CREATE UNIQUE INDEX "Participant_tickedId_key" ON "Participant"("tickedId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
