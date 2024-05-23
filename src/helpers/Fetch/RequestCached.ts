"use strict";

class RequestCached {
  private cache = new Map();
  public static instance: RequestCached | null = null;

  private constructor() {}

  public memorize(key: string, value: any, timeout?: number | string) {
    if (!this.cache.has(key) && typeof timeout === "number") {
      this.cache.set(key, value);

      if (timeout) {
        setTimeout(() => {
          this.cache.delete(key);
        }, timeout);
      }
    } else if (
      !this.cache.has(key) &&
      typeof timeout === "string" &&
      timeout === "pernament"
    ) {
      this.cache.set(key, value);
    }
  }

  public get(key: string): any {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    return null;
  }

  public clear() {
    this.cache = new Map();
  }

  public static getInstance(): RequestCached {
    if (!RequestCached.instance) {
      RequestCached.instance = new RequestCached();
    }

    return RequestCached.instance;
  }
}

export default RequestCached;
