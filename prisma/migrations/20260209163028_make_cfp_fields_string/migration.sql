/*
  Warnings:

  - The `submissionForm` column on the `CFP` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "CFP" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "deadline" DROP NOT NULL,
ALTER COLUMN "deadline" SET DATA TYPE TEXT,
ALTER COLUMN "conferenceDate" DROP NOT NULL,
ALTER COLUMN "conferenceDate" SET DATA TYPE TEXT,
ALTER COLUMN "url" DROP NOT NULL,
ALTER COLUMN "callback" DROP NOT NULL,
ALTER COLUMN "callback" SET DATA TYPE TEXT,
DROP COLUMN "submissionForm",
ADD COLUMN     "submissionForm" TEXT,
ALTER COLUMN "wordCharacterLimit" SET DATA TYPE TEXT;
