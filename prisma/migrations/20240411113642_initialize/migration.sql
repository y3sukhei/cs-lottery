-- CreateTable
CREATE TABLE "Gift" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "img" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tickedId" TEXT NOT NULL,
    "giftId" INTEGER NOT NULL,
    CONSTRAINT "Participant_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gift" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_tickedId_key" ON "Participant"("tickedId");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_giftId_key" ON "Participant"("giftId");
