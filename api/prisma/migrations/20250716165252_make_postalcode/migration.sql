/*
  Warnings:

  - You are about to drop the column `zipCode` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `postalCode` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "zipCode",
ADD COLUMN     "postalCode" VARCHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "zipCode",
ADD COLUMN     "postalCode" VARCHAR(10) NOT NULL;
