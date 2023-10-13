-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bank_Accounts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bank_name" TEXT NOT NULL,
    "bank_account_number" TEXT NOT NULL,
    "ballance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Bank_Accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "identity_type" TEXT NOT NULL,
    "identity_number" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "source_account_id" INTEGER NOT NULL,
    "destination_account_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_user_id_key" ON "Profile"("user_id");

-- AddForeignKey
ALTER TABLE "Bank_Accounts" ADD CONSTRAINT "Bank_Accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_source_account_id_fkey" FOREIGN KEY ("source_account_id") REFERENCES "Bank_Accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_destination_account_id_fkey" FOREIGN KEY ("destination_account_id") REFERENCES "Bank_Accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
