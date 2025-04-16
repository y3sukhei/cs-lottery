/*
  Warnings:

  - You are about to drop the column `participantId` on the `Gift` table. All the data in the column will be lost.
  - Added the required column `winnerCount` to the `Gift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `giftId` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Gift" DROP CONSTRAINT "Gift_participantId_fkey";

-- DropIndex
DROP INDEX "Gift_participantId_key";

-- AlterTable
ALTER TABLE "Gift" DROP COLUMN "participantId",
ADD COLUMN     "winnerCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "giftId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
