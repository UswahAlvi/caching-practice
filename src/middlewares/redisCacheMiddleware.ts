import {RedisService} from "../services/redisService";
import {NextFunction, Request, Response} from "express";

export const redisCacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const cached = await RedisService.get(id);
    if (cached) {
        return res.json({
            result: JSON.parse(cached), // Redis stores strings
            message: 'Returning from Redis cache',
        });
    }
    next();
};
