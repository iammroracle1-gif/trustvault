// Shared in-memory database for admin operations
// In production, replace with PostgreSQL/MongoDB

export interface User {
  walletId: string;
  email: string;
  balance: number;
  withdrawalRestricted: boolean;
  restrictionReason: string;
  createdAt: string;
  lastActivity: string;
  totalTransactions: number;
  status: 'active' | 'restricted' | 'suspended' | 'deleted';
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'admin_deposit' | 'withdrawal' | 'transfer' | 'trade';
  amount: number;
  note?: string;
  oldBalance: number;
  newBalance: number;
  createdAt: string;
  adminId?: string;
}

// Shared users database
export const adminUsers = new Map<string, User>();

// Shared transactions log
export const transactions: Transaction[] = [];

// Initialize demo data on first load
if (adminUsers.size === 0) {
  adminUsers.set('wallet-1', {
    walletId: 'wallet-1',
    email: 'user1@example.com',
    balance: 5000.00,
    withdrawalRestricted: false,
    restrictionReason: '',
    createdAt: new Date('2024-01-15').toISOString(),
    lastActivity: new Date().toISOString(),
    totalTransactions: 45,
    status: 'active',
  });
  
  adminUsers.set('wallet-2', {
    walletId: 'wallet-2',
    email: 'user2@example.com',
    balance: 12000.50,
    withdrawalRestricted: true,
    restrictionReason: 'Pending KYC verification',
    createdAt: new Date('2024-02-01').toISOString(),
    lastActivity: new Date().toISOString(),
    totalTransactions: 23,
    status: 'restricted',
  });
}

// Helper functions
export function getUser(walletId: string): User | undefined {
  return adminUsers.get(walletId);
}

export function getAllUsers(): User[] {
  return Array.from(adminUsers.values());
}

export function updateUser(walletId: string, updates: Partial<User>): User | null {
  const user = adminUsers.get(walletId);
  if (!user) return null;

  const updatedUser = {
    ...user,
    ...updates,
    lastActivity: new Date().toISOString(),
  };

  adminUsers.set(walletId, updatedUser);
  return updatedUser;
}

export function addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
  const newTransaction: Transaction = {
    ...transaction,
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };

  transactions.push(newTransaction);
  return newTransaction;
}

export function getUserTransactions(walletId: string): Transaction[] {
  return transactions.filter(tx => tx.userId === walletId);
}

export function getAllTransactions(): Transaction[] {
  return transactions;
}
