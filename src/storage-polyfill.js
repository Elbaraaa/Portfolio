// Polyfill for window.storage (Claude artifact API) using localStorage
const storagePolyfill = {
  async get(key, shared) {
    try {
      const prefix = shared ? "shared:" : "personal:";
      const val = localStorage.getItem(prefix + key);
      if (val === null) throw new Error("Key not found");
      return { key, value: val, shared: !!shared };
    } catch (e) {
      throw e;
    }
  },
  async set(key, value, shared) {
    try {
      const prefix = shared ? "shared:" : "personal:";
      localStorage.setItem(prefix + key, value);
      return { key, value, shared: !!shared };
    } catch (e) {
      return null;
    }
  },
  async delete(key, shared) {
    const prefix = shared ? "shared:" : "personal:";
    localStorage.removeItem(prefix + key);
    return { key, deleted: true, shared: !!shared };
  },
  async list(prefix, shared) {
    const storagePrefix = shared ? "shared:" : "personal:";
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i);
      if (fullKey.startsWith(storagePrefix)) {
        const realKey = fullKey.slice(storagePrefix.length);
        if (!prefix || realKey.startsWith(prefix)) {
          keys.push(realKey);
        }
      }
    }
    return { keys, prefix, shared: !!shared };
  },
};

if (!window.storage) {
  window.storage = storagePolyfill;
}

export default storagePolyfill;
