/*
  Warnings:

  - You are about to drop the column `UserRole` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "UserRole",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
