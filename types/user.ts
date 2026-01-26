export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  followedInstagram: boolean;
  followedYoutube: boolean;
  followedInstagram2: boolean;
  registeredAt: string;
  participatedGiveaways: string[];
  balance: number;
}

export interface WithdrawHistory {
  id: string;
  amount: number;
  date: string;
  status: 'pending' | 'success' | 'failed';
  accountNumber: string;
}
