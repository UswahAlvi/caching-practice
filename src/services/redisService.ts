import { createClient } from 'redis';

const redis = createClient({
    socket: {
        host: 'localhost',
        port: 6379
    }
});

redis.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    await redis.connect();
})();

export class RedisService {
    public static async get(key: string): Promise<any> {
        return await redis.get(key);
    }

    public static async set(key: string, value: any) {
        await redis.set(key, value);
    }

    public static async delete(key: string) {
        await redis.del(key);
    }

}
