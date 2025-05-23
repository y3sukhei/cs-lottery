/*
  Warnings:

  - You are about to drop the column `tickedId` on the `Participant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ticketId]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ticketId` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Participant_tickedId_key";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "tickedId",
ADD COLUMN     "ticketId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Participant_ticketId_key" ON "Participant"("ticketId");
