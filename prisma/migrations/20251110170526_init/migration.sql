-- CreateEnum
CREATE TYPE "api_order_status" AS ENUM ('pending', 'inprogress', 'complete');

-- CreateTable
CREATE TABLE "api_student" (
    "bag_no" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "enrollment_no" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone_no" TEXT NOT NULL,
    "residency_no" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_student_pkey" PRIMARY KEY ("bag_no")
);

-- CreateTable
CREATE TABLE "api_washerman" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_washerman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_order" (
    "id" SERIAL NOT NULL,
    "bag_no" TEXT NOT NULL,
    "number_of_clothes" INTEGER NOT NULL,
    "status" "api_order_status" NOT NULL DEFAULT 'pending',
    "submission_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_student_email_key" ON "api_student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "api_student_enrollment_no_key" ON "api_student"("enrollment_no");

-- CreateIndex
CREATE UNIQUE INDEX "api_washerman_username_key" ON "api_washerman"("username");

-- CreateIndex
CREATE INDEX "api_order_bag_no_idx" ON "api_order"("bag_no");

-- CreateIndex
CREATE INDEX "api_order_status_idx" ON "api_order"("status");

-- AddForeignKey
ALTER TABLE "api_order" ADD CONSTRAINT "api_order_bag_no_fkey" FOREIGN KEY ("bag_no") REFERENCES "api_student"("bag_no") ON DELETE CASCADE ON UPDATE CASCADE;
