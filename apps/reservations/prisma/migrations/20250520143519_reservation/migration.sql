-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);
