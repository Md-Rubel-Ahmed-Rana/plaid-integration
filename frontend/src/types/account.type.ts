export type IChildAccount = {
  id: string;
  name: string;
  official_name: string;
  type: string;
  subtype: string;
  mask: string;
  balance: {
    available: number;
    current: number;
    currency: string;
  };
  is_default_payout: boolean;
};

export type IParentAccount = {
  id: string;
  institution_name: string;
  item_id: string;
  createdAt: string;
  accounts: IChildAccount[];
};
