import { pgTable, text, serial, integer, boolean, timestamp, bigint, numeric, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  tgId: bigint("tg_id", { mode: "number" }).notNull().unique(),
  username: text("username"),
  password: text("password"), // Optional if using Telegram Auth only
  coins: doublePrecision("coins").default(0).notNull(),
  status: text("status").default("active").notNull(), // active, banned
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const coins = pgTable("coins", {
  symbol: text("symbol").primaryKey(),
  name: text("name").notNull(),
  minWithdrawal: integer("min_withdrawal").notNull().default(100),
  maxWithdrawal: integer("max_withdrawal").notNull().default(10000),
  iconUrl: text("icon_url").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const withdrawals = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  tgId: bigint("tg_id", { mode: "number" }).notNull(),
  coin: text("coin").notNull(),
  amount: doublePrecision("amount").notNull(),
  platform: text("platform").default("FaucetPay").notNull(),
  email: text("email").notNull(),
  status: text("status").default("Pending").notNull(), // Pending, Approved, Rejected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// === ZOD SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertCoinSchema = createInsertSchema(coins);
export const insertWithdrawalSchema = createInsertSchema(withdrawals).omit({ id: true, createdAt: true, updatedAt: true });

// === EXPLICIT TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Coin = typeof coins.$inferSelect;
export type InsertCoin = z.infer<typeof insertCoinSchema>;

export type Withdrawal = typeof withdrawals.$inferSelect;
export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;

// API Request/Response Types
export type CreateWithdrawalRequest = {
  coin: string;
  amount: number;
  email: string;
};

export type WithdrawalHistoryResponse = Withdrawal[];
export type CoinsListResponse = Coin[];
