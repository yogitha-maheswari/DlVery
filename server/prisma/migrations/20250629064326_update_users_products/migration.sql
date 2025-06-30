/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "category" TEXT,
ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "isDamaged" BOOLEAN,
ADD COLUMN     "isPerishable" BOOLEAN;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "password" TEXT,
ADD COLUMN     "role" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
