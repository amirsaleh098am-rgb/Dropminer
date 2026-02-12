import { users, coins, withdrawals, type User, type InsertUser, type Coin, type Withdrawal, type InsertWithdrawal } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User
  getUserByTgId(tgId: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(tgId: number, newBalance: number): Promise<User>;
  updateUserEmail(tgId: number, email: string): Promise<void>;

  // Coins
  getCoins(): Promise<Coin[]>;
  getCoin(symbol: string): Promise<Coin | undefined>;
  seedCoins(): Promise<void>;

  // Withdrawals
  createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal>;
  getWithdrawals(tgId: number, limit: number): Promise<Withdrawal[]>;
}

export class DatabaseStorage implements IStorage {
  async getUserByTgId(tgId: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.tgId, tgId));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUserBalance(tgId: number, newBalance: number): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ coins: newBalance })
      .where(eq(users.tgId, tgId))
      .returning();
    return updatedUser;
  }

  async updateUserEmail(tgId: number, email: string): Promise<void> {
    await db.update(users).set({ email }).where(eq(users.tgId, tgId));
  }

  async getCoins(): Promise<Coin[]> {
    return await db.select().from(coins);
  }

  async getCoin(symbol: string): Promise<Coin | undefined> {
    const [coin] = await db.select().from(coins).where(eq(coins.symbol, symbol));
    return coin;
  }

  async seedCoins(): Promise<void> {
    const existing = await this.getCoins();
    if (existing.length === 0) {
      const defaultCoins = [
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          minWithdrawal: 100,
          maxWithdrawal: 10000,
          iconUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
          isActive: true
        },
        {
          symbol: 'TRX',
          name: 'Tron',
          minWithdrawal: 100,
          maxWithdrawal: 10000,
          iconUrl: 'https://cryptologos.cc/logos/tron-trx-logo.png',
          isActive: true
        },
        {
          symbol: 'USDT',
          name: 'Tether',
          minWithdrawal: 100,
          maxWithdrawal: 10000,
          iconUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
          isActive: true
        },
        {
          symbol: 'TON',
          name: 'TON',
          minWithdrawal: 100,
          maxWithdrawal: 10000,
          iconUrl: 'https://cryptologos.cc/logos/toncoin-ton-logo.png',
          isActive: true
        },
        {
          symbol: 'DOGE',
          name: 'Dogecoin',
          minWithdrawal: 100,
          maxWithdrawal: 10000,
          iconUrl: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
          isActive: true
        },
        {
          symbol: 'LTC',
          name: 'Litecoin',
          minWithdrawal: 100,
          maxWithdrawal: 10000,
          iconUrl: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png',
          isActive: true
        },
      ];
      await db.insert(coins).values(defaultCoins);
    }
  }

  async createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal> {
    const [newWithdrawal] = await db.insert(withdrawals).values(withdrawal).returning();
    return newWithdrawal;
  }

  async getWithdrawals(tgId: number, limit: number): Promise<Withdrawal[]> {
    return await db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.tgId, tgId))
      .orderBy(desc(withdrawals.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
