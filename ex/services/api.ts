
import { User, InvestmentPlan, Transaction, Investment, TransactionType, TransactionStatus } from '../types';

/**
 * MOCK API SERVICE
 * This mimics a real backend API for mobile application integration.
 * In a real production environment, these would be fetch() calls to a Node.js/Go/Python server.
 */

class ApiService {
  private getStorage<T>(key: string, defaultValue: T): T {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  }

  // --- Auth Endpoints ---
  async login(email: string): Promise<{ user: User; token: string } | null> {
    const users = this.getStorage<User[]>('hyip_users', []);
    const user = users.find(u => u.email === email);
    if (!user) return null;
    return { user, token: 'mock-jwt-token-' + user.id };
  }

  // --- Account Endpoints ---
  async getProfile(userId: string): Promise<User | null> {
    const users = this.getStorage<User[]>('hyip_users', []);
    return users.find(u => u.id === userId) || null;
  }

  // --- Investment Endpoints ---
  async getPlans(): Promise<InvestmentPlan[]> {
    return this.getStorage<InvestmentPlan[]>('hyip_plans', []);
  }

  async createInvestment(userId: string, planId: string, amount: number): Promise<Investment> {
    // Logic simulated here...
    const investment: Investment = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      planId,
      amount,
      earnedSoFar: 0,
      startDate: Date.now(),
      nextPayout: Date.now() + 60000,
      totalPayouts: 0,
      status: 'ACTIVE'
    };
    return investment;
  }

  // --- Transaction Endpoints ---
  async getTransactions(userId: string): Promise<Transaction[]> {
    const all = this.getStorage<Transaction[]>('hyip_transactions', []);
    return all.filter(t => t.userId === userId);
  }

  async requestWithdrawal(userId: string, amount: number, method: string): Promise<Transaction> {
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      amount,
      type: TransactionType.WITHDRAWAL,
      status: TransactionStatus.PENDING,
      date: Date.now(),
      method
    };
    return tx;
  }
}

export const api = new ApiService();
