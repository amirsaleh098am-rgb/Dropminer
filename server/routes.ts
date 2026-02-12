import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authMiddleware } from "./middleware/auth";
import { errorHandler, AppError, asyncHandler } from "./middleware/errorHandler";
import { initRedis, invalidateUserCache, logger } from "./utils/cache";
import jwt from "jsonwebtoken";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_12345';

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Initialize Redis
  await initRedis();
  
  // Seed Coins
  await storage.seedCoins();

  // === AUTH ROUTES (Mock for Dev/Lite) ===
  app.post('/auth/login', asyncHandler(async (req: Request, res: Response) => {
    // In a real Telegram Mini App, we would validate initData here.
    // For this build, we mock login with a tg_id.
    const { tg_id, username } = req.body;
    
    if (!tg_id) {
      throw new AppError(400, 'tg_id is required');
    }

    let user = await storage.getUserByTgId(Number(tg_id));
    if (!user) {
      user = await storage.createUser({
        tgId: Number(tg_id),
        username: username || `User${tg_id}`,
        password: '', // Not used
        status: 'active',
        coins: 0,
        email: ''
      });
    }

    const token = jwt.sign({ tg_id: user.tgId, username: user.username, iat: Math.floor(Date.now() / 1000) }, JWT_SECRET);

    res.json({
      status: 'success',
      token,
      user
    });
  }));

  // === MINING ROUTES ===
  app.get('/api/mining/status', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const tg_id = req.user!.tg_id;
    const user = await storage.getUserByTgId(tg_id);
    
    if (!user) throw new AppError(404, 'User not found');

    res.json({
      status: 'success',
      balance: user.coins
    });
  }));

  app.post('/api/mining/collect', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const tg_id = req.user!.tg_id;
    const user = await storage.getUserByTgId(tg_id);
    
    if (!user) throw new AppError(404, 'User not found');

    // Simulate mining collection
    const collectedAmount = 10; // Fixed amount for now
    const newBalance = (user.coins || 0) + collectedAmount;
    
    await storage.updateUserBalance(tg_id, newBalance);
    await invalidateUserCache(tg_id);

    res.json({
      status: 'success',
      collected: collectedAmount,
      newBalance
    });
  }));

  app.post('/api/mining/ad', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const tg_id = req.user!.tg_id;
    const user = await storage.getUserByTgId(tg_id);
    
    if (!user) throw new AppError(404, 'User not found');

    // Simulate ad watch reward
    const reward = 50;
    const newBalance = (user.coins || 0) + reward;
    
    await storage.updateUserBalance(tg_id, newBalance);
    await invalidateUserCache(tg_id);

    res.json({
      status: 'success',
      reward,
      newBalance
    });
  }));

  // === WITHDRAW ROUTES ===
  app.get('/api/withdraw/coins', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const coins = await storage.getCoins();
    res.json({
      status: 'success',
      coins
    });
  }));

  app.post('/api/withdraw', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const { coin, amount, email } = req.body;
    const tg_id = req.user!.tg_id;

    // Validation
    const schema = z.object({
      coin: z.string(),
      amount: z.number().positive(),
      email: z.string().email(),
    });

    const validated = schema.parse({ coin, amount: Number(amount), email });

    const user = await storage.getUserByTgId(tg_id);
    if (!user) throw new AppError(404, 'User not found');
    if (user.status !== 'active') throw new AppError(403, 'Account banned');

    const coinData = await storage.getCoin(validated.coin);
    if (!coinData) throw new AppError(400, 'Coin not found');

    if (validated.amount < coinData.minWithdrawal || validated.amount > coinData.maxWithdrawal) {
      throw new AppError(400, `Amount must be between ${coinData.minWithdrawal} and ${coinData.maxWithdrawal}`);
    }

    if (user.coins < validated.amount) {
      throw new AppError(400, `Insufficient balance. You need ${validated.amount - user.coins} more.`);
    }

    // Deduct balance
    const newBalance = user.coins - validated.amount;
    await storage.updateUserBalance(tg_id, newBalance);
    await storage.updateUserEmail(tg_id, validated.email);

    // Create withdrawal record
    const withdrawal = await storage.createWithdrawal({
      tgId: tg_id,
      coin: validated.coin,
      amount: validated.amount,
      email: validated.email,
      platform: 'FaucetPay',
      status: 'Pending'
    });
    
    await invalidateUserCache(tg_id);

    logger.info(`Withdrawal created: ${withdrawal.id} - User: ${tg_id} - Amount: ${validated.amount} ${validated.coin}`);

    res.status(201).json({
      status: 'success',
      message: 'Withdrawal request created successfully',
      withdrawal
    });
  }));

  app.get('/api/withdraw/history', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const tg_id = req.user!.tg_id;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    
    const history = await storage.getWithdrawals(tg_id, limit);
    
    res.json({
      status: 'success',
      count: history.length,
      withdrawals: history
    });
  }));

  // === REFERRAL ROUTES ===
  app.get('/api/referral/stats', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    // Mock referral stats for now
    res.json({
      status: 'success',
      referrals: 0,
      earnings: 0,
      link: `https://t.me/MyMinerBot?start=${req.user!.tg_id}`
    });
  }));

  return httpServer;
}
