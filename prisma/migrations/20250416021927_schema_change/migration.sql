-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_giftId_fkey";

-- AlterTable
ALTER TABLE "Participant" ALTER COLUMN "giftId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gift"("id") ON DELETE SET NULL ON UPDATE CASCADE;
