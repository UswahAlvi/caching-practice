import {Request, Response, NextFunction} from "express";
import {Cache} from "../services/nodeCacheService";

export const nodeCacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    if(!Cache.has(id)) {
        return next()
    }
    const result=Cache.get(id);
    return res.json({result, message: 'Returning from node cache middleware'});
}