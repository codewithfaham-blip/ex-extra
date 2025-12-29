
import { InvestmentPlan, User, UserRole } from './types';

export const INITIAL_PLANS: InvestmentPlan[] = [
  {
    id: 'plan_1',
    name: 'Standard Alpha',
    minAmount: 10,
    maxAmount: 100,
    roi: 1.5,
    period: 'DAILY',
    durationDays: 30,
  },
  {
    id: 'plan_2',
    name: 'Ethereum Plus',
    minAmount: 101,
    maxAmount: 500,
    roi: 2.5,
    period: 'DAILY',
    durationDays: 45,
  },
  {
    id: 'plan_3',
    name: 'Bitcoin Pro',
    minAmount: 501,
    maxAmount: 1000,
    roi: 4.0,
    period: 'DAILY',
    durationDays: 60,
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'admin_1',
    email: 'admin@hyip.com',
    name: 'Platform Administrator',
    avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    role: UserRole.ADMIN,
    balance: 0,
    totalInvested: 0,
    totalWithdrawn: 0,
    referralCode: 'ADMIN_PLATINUM',
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    isBlocked: false,
    // Fix: Adding missing properties required by the User interface in types.ts
    kycLevel: 1,
    twoFactorEnabled: false,
  },
  {
    id: 'user_1',
    email: 'demo@user.com',
    name: 'John Doe',
    role: UserRole.USER,
    balance: 5,
    totalInvested: 1200,
    totalWithdrawn: 450,
    referralCode: 'JOHNDOE77',
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    isBlocked: false,
    // Fix: Adding missing properties required by the User interface in types.ts
    kycLevel: 1,
    twoFactorEnabled: false,
  }
];
