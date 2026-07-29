import { EventEmitter } from "events";

const store = new Map();

export class RedisMock extends EventEmitter {
  constructor() {
    super();
    // Simulate connection events asynchronously
    process.nextTick(() => {
      this.emit("connect");
      this.emit("ready");
    });
  }

  async get(key) {
    const item = store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key, value, ...args) {
    let ttlSeconds = null;
    let nx = false;

    for (let i = 0; i < args.length; i++) {
      if (typeof args[i] === "string" && args[i].toUpperCase() === "EX") {
        ttlSeconds = Number(args[i + 1]);
      }
      if (typeof args[i] === "string" && args[i].toUpperCase() === "NX") {
        nx = true;
      }
    }

    if (nx) {
      const existing = await this.get(key);
      if (existing !== null) {
        return null; // NX condition failed, returns null (or "OK" if success)
      }
    }

    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    store.set(key, { value: String(value), expiresAt });
    return "OK";
  }

  async del(...keys) {
    let deletedCount = 0;
    const flatKeys = keys.flat();
    for (const key of flatKeys) {
      if (store.has(key)) {
        store.delete(key);
        deletedCount++;
      }
    }
    return deletedCount;
  }

  async exists(key) {
    const val = await this.get(key);
    return val !== null ? 1 : 0;
  }

  async keys(pattern) {
    const matchedKeys = [];
    const now = Date.now();
    
    // Convert glob pattern to regex. E.g., analytics:*123* -> ^analytics:.*123.*$
    const regexStr = "^" + pattern.replace(/[\-+*?[^$(){}\[\]\\]/g, (match) => {
      if (match === "*") return ".*";
      if (match === "?") return ".";
      return "\\" + match;
    }) + "$";
    const regex = new RegExp(regexStr);

    for (const [key, item] of store.entries()) {
      if (item.expiresAt && now > item.expiresAt) {
        store.delete(key);
        continue;
      }
      if (regex.test(key)) {
        matchedKeys.push(key);
      }
    }
    return matchedKeys;
  }

  // Define command no-op for custom scripts compatibility
  defineCommand() {}

  async quit() {
    return "OK";
  }

  async disconnect() {
    return "OK";
  }
}
