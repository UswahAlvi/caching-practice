import NodeCache from "node-cache";

const cache = new NodeCache();

export class Cache{
    public static set(key: string, value: any) {
        cache.set(key, value);
    }
    public static get(key: string): any {
        return cache.get(key);
    }
    public static delete(key: string): any {
        return cache.del(key)
    }
    public static has(key: string): boolean{
        return cache.has(key);
    }
}