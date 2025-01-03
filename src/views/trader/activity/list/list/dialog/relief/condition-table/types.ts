export interface ConditionItem {
  id: number;
  amount: number | null;
  ratio: number | null;
  vipLv: number | null;
}

export interface FormattedConditionItem {
  amount: number;
  ratio: number;
  vipLv: number;
}
