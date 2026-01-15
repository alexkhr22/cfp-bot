/*
  Warnings:

  - You are about to drop the `_CFPToKeywordGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_KeywordGroupToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `CFP` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CFPToKeywordGroup" DROP CONSTRAINT "_CFPToKeywordGroup_A_fkey";

-- DropForeignKey
ALTER TABLE "_CFPToKeywordGroup" DROP CONSTRAINT "_CFPToKeywordGroup_B_fkey";

-- DropForeignKey
ALTER TABLE "_KeywordGroupToUser" DROP CONSTRAINT "_KeywordGroupToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_KeywordGroupToUser" DROP CONSTRAINT "_KeywordGroupToUser_B_fkey";

-- AlterTable
ALTER TABLE "CFP" ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_CFPToKeywordGroup";

-- DropTable
DROP TABLE "_KeywordGroupToUser";

-- CreateTable
CREATE TABLE "UserKeywordGroup" (
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "UserKeywordGroup_pkey" PRIMARY KEY ("userId","groupId")
);

-- CreateTable
CREATE TABLE "CFPKeywordGroup" (
    "cfpId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "CFPKeywordGroup_pkey" PRIMARY KEY ("cfpId","groupId")
);

-- AddForeignKey
ALTER TABLE "CFP" ADD CONSTRAINT "CFP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserKeywordGroup" ADD CONSTRAINT "UserKeywordGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserKeywordGroup" ADD CONSTRAINT "UserKeywordGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "KeywordGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CFPKeywordGroup" ADD CONSTRAINT "CFPKeywordGroup_cfpId_fkey" FOREIGN KEY ("cfpId") REFERENCES "CFP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CFPKeywordGroup" ADD CONSTRAINT "CFPKeywordGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "KeywordGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
