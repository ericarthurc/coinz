export interface IDtoExpense {
  id: number;
  store: string;
  expense_spent: number;
  expense_timestamp?: Date | number;
}

export interface IDtoBudget {
  id: number;
  budget_amount: number;
  category_name: string;
  category_amount: number;
  month: string;
  expenses: IDtoExpense[];
}
