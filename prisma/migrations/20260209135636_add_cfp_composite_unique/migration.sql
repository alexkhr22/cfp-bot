/*
  Warnings:

  - A unique constraint covering the columns `[url,title,conferenceDate]` on the table `CFP` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CFP_url_title_conferenceDate_key" ON "CFP"("url", "title", "conferenceDate");
