export type Budget = {
  id: number;
  category_id: number;
  category_name: string;
  budget_amount: number;
  month: string;
  expenses: Expense[];
};

export type Expense = {
  id: number;
  amount: number;
  merchant: string;
  transaction_date: string;
};
