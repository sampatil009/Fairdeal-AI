export type UserTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
export type UserRole = 'buyer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  tier: UserTier;
  createdAt: string;
  avatar?: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: UserRole;
  tier: UserTier;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  tier?: UserTier;
}
