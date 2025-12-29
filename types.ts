
export type TransactionType = 'income' | 'expense';
export type ExpenseType = 'fixed' | 'variable';
export type IncomeCategory = 'salary' | 'freelance' | 'extra' | 'investment' | 'other';
export type TransactionStatus = 'paid' | 'pending';

export interface Profile {
  id: string;
  email: string;
  nickname: string;
  full_name: string;
  cpf: string;
  phone: string;
  country: string;
  language: string;
  recovery_phrase: string;
  is_premium: boolean;
  avatar_url?: string;
  total_invested_base?: number;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  sub_type?: ExpenseType; // Only for expenses
  income_category?: IncomeCategory; // Only for income
  description: string;
  amount: number;
  date: string;
  category: string;
  status: TransactionStatus;
  payment_method: string;
  card_id?: string;
  receipt_url?: string;
  created_at?: string;
}

export interface Card {
  id: string;
  user_id: string;
  name: string;
  institution: string;
  last_digits: string;
  total_limit: number;
  due_day: number;
  closing_day: number;
  color: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'alert' | 'success' | 'info' | 'warning';
  read: boolean;
  link?: string;
  created_at: string;
}

export interface TranslationDict {
  [key: string]: {
    [lang: string]: string;
  };
}