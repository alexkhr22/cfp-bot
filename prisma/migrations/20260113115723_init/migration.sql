-- CreateEnum
CREATE TYPE "SubmissionForm" AS ENUM ('PDF', 'EASYCHAIR', 'OPENREVIEW', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tags" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeywordGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "keywords" TEXT[],

    CONSTRAINT "KeywordGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CFP" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "conferenceDate" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "callback" TIMESTAMP(3) NOT NULL,
    "submissionForm" "SubmissionForm" NOT NULL,
    "wordCharacterLimit" INTEGER,
    "tag" TEXT,

    CONSTRAINT "CFP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_KeywordGroupToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_KeywordGroupToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CFPToKeywordGroup" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CFPToKeywordGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_KeywordGroupToUser_B_index" ON "_KeywordGroupToUser"("B");

-- CreateIndex
CREATE INDEX "_CFPToKeywordGroup_B_index" ON "_CFPToKeywordGroup"("B");

-- AddForeignKey
ALTER TABLE "_KeywordGroupToUser" ADD CONSTRAINT "_KeywordGroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "KeywordGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeywordGroupToUser" ADD CONSTRAINT "_KeywordGroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CFPToKeywordGroup" ADD CONSTRAINT "_CFPToKeywordGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "CFP"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CFPToKeywordGroup" ADD CONSTRAINT "_CFPToKeywordGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "KeywordGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
