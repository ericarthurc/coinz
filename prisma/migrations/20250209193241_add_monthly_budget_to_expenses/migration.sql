/*
  Warnings:

  - Added the required column `monthly_budgets_id` to the `expenses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "expenses" ADD COLUMN     "monthly_budgets_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_monthly_budgets_id_fkey" FOREIGN KEY ("monthly_budgets_id") REFERENCES "monthly_budgets"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
