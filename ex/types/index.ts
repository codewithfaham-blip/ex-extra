
export enum UserRole { USER = 'USER', ADMIN = 'ADMIN' }
export enum TransactionStatus { PENDING = 'PENDING', COMPLETED = 'COMPLETED', REJECTED = 'REJECTED' }
export enum TransactionType { DEPOSIT = 'DEPOSIT', WITHDRAWAL = 'WITHDRAWAL', PROFIT = 'PROFIT', REFERRAL = 'REFERRAL' }
export interface User { id: string; email: string; name: string; avatar?: string; role: UserRole; balance: number; totalInvested: number; totalWithdrawn: number; referralCode: string; referredBy?: string; createdAt: number; isBlocked: boolean; kycLevel: 0 | 1 | 2; twoFactorEnabled: boolean; }
export interface InvestmentPlan { id: string; name: string; minAmount: number; maxAmount: number; roi: number; period: 'DAILY' | 'HOURLY' | 'WEEKLY'; durationDays: number; }
export interface Investment { id: string; userId: string; planId: string; amount: number; earnedSoFar: number; startDate: number; nextPayout: number; totalPayouts: number; status: 'ACTIVE' | 'COMPLETED'; }
export interface Transaction { id: string; userId: string; amount: number; type: TransactionType; status: TransactionStatus; date: number; method?: string; details?: string; }
