/*
  Warnings:

  - Added the required column `userId` to the `BankTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankTransaction" ADD COLUMN     "userId" INTEGER NOT NULL;
