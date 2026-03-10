-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('UNKNOWN', 'PUBLIC', 'PRIVATE', 'MEMBERSHIP_REQUIRED', 'ONE_TIME_FEE');

-- CreateTable
CREATE TABLE "Court" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "numOfCourts" INTEGER NOT NULL,
    "access" "AccessType" NOT NULL DEFAULT 'UNKNOWN',
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Court_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Court_slug_key" ON "Court"("slug");
