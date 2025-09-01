export interface CreateSubscriptionDto {
  user_id: number;
  plan_id: number;
  start_date: Date;
  end_date: Date;
  auto_renew?: boolean;
}

export interface UpdateSubscriptionDto {
  status?: 'active' | 'inactive' | 'cancelled' | 'expired';
  end_date?: Date;
  auto_renew?: boolean;
}

export interface SubscriptionResponseDto {
  id: number;
  user_id: number;
  plan_id: number;
  plan_name: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  start_date: Date;
  end_date: Date;
  auto_renew: boolean;
  createdAt: Date;
  updatedAt: Date;
}