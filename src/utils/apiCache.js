// Cache management for API responses
class APICache {
  constructor(maxSize = 10, ttl = 5 * 60 * 1000) { // 5 minutes TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.storageKey = 'travelAdvisor_apiCache';
    this.loadFromStorage();
  }

  // Load cache from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const cacheData = JSON.parse(stored);
        const now = Date.now();
        
        // Restore only non-expired entries
        cacheData.forEach(({ key, entry }) => {
          if (now - entry.timestamp < this.ttl) {
            this.cache.set(key, entry);
          }
        });
        
        if (this.cache.size > 0) {
          console.log(`✅ Loaded ${this.cache.size} cached entries from localStorage`);
        }
      }
    } catch (error) {
      console.error('Error loading cache from localStorage:', error);
      localStorage.removeItem(this.storageKey);
    }
  }

  // Save cache to localStorage
  saveToStorage() {
    try {
      const cacheArray = Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        entry
      }));
      localStorage.setItem(this.storageKey, JSON.stringify(cacheArray));
    } catch (error) {
      console.error('Error saving cache to localStorage:', error);
      // If storage is full, clear old cache
      if (error.name === 'QuotaExceededError') {
        this.clear();
      }
    }
  }

  // Generate cache key from bounds
  generateKey(type, bounds) {
    const { sw, ne } = bounds;
    // Round coordinates to reduce key variations
    const key = `${type}_${sw.lat.toFixed(2)}_${sw.lng.toFixed(2)}_${ne.lat.toFixed(2)}_${ne.lng.toFixed(2)}`;
    return key;
  }

  // Check if bounds are within cached area
  isWithinCachedBounds(requestedBounds, cachedBounds) {
    const { sw: reqSw, ne: reqNe } = requestedBounds;
    const { sw: cacheSw, ne: cacheNe } = cachedBounds;

    // Check if requested bounds are within cached bounds
    return (
      reqSw.lat >= cacheSw.lat &&
      reqSw.lng >= cacheSw.lng &&
      reqNe.lat <= cacheNe.lat &&
      reqNe.lng <= cacheNe.lng
    );
  }

  // Expand bounds by percentage
  expandBounds(bounds, factor = 0.5) {
    const { sw, ne } = bounds;
    const latDiff = ne.lat - sw.lat;
    const lngDiff = ne.lng - sw.lng;

    return {
      sw: {
        lat: sw.lat - latDiff * factor,
        lng: sw.lng - lngDiff * factor,
      },
      ne: {
        lat: ne.lat + latDiff * factor,
        lng: ne.lng + lngDiff * factor,
      },
    };
  }

  get(type, bounds) {
    // Check each cached entry to see if requested bounds are within it
    for (const [key, entry] of this.cache.entries()) {
      if (entry.type === type) {
        const now = Date.now();
        
        // Check if cache is still valid
        if (now - entry.timestamp < this.ttl) {
          // Check if requested bounds are within cached bounds
          if (this.isWithinCachedBounds(bounds, entry.bounds)) {
            console.log('✅ Cache hit for', type, '- using cached data');
            return entry.data;
          }
        } else {
          // Remove expired entry
          this.cache.delete(key);
        }
      }
    }
    
    console.log('❌ Cache miss for', type, '- fetching new data');
    return null;
  }

  set(type, bounds, data) {
    // Expand bounds before caching to cover larger area
    const expandedBounds = this.expandBounds(bounds, 0.5); // 50% expansion
    const key = this.generateKey(type, expandedBounds);

    // If cache is full, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      console.log('🗑️ Cache full - removed oldest entry');
    }

    this.cache.set(key, {
      type,
      bounds: expandedBounds,
      data,
      timestamp: Date.now(),
    });

    // Persist to localStorage
    this.saveToStorage();

    console.log(`💾 Cached ${data.length} ${type} for expanded area`);
  }

  clear() {
    this.cache.clear();
    localStorage.removeItem(this.storageKey);
    console.log('🧹 Cache cleared from memory and localStorage');
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.cache.keys()),
    };
  }
}

// Rate limiter for API calls
class RateLimiter {
  constructor(maxRequests = 15, windowMs = 60 * 60 * 1000) { // 15 requests per hour
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.loadFromStorage();
  }

  loadFromStorage() {
    const stored = localStorage.getItem('apiRateLimit');
    if (stored) {
      const data = JSON.parse(stored);
      const now = Date.now();
      
      // Reset if window has passed
      if (now - data.windowStart > this.windowMs) {
        this.requests = [];
        this.windowStart = now;
      } else {
        this.requests = data.requests.filter(time => now - time < this.windowMs);
        this.windowStart = data.windowStart;
      }
    } else {
      this.requests = [];
      this.windowStart = Date.now();
    }
  }

  saveToStorage() {
    localStorage.setItem('apiRateLimit', JSON.stringify({
      requests: this.requests,
      windowStart: this.windowStart,
    }));
  }

  canMakeRequest() {
    const now = Date.now();
    
    // Clean up old requests
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    // Check if under limit
    if (this.requests.length < this.maxRequests) {
      return true;
    }
    
    return false;
  }

  recordRequest() {
    const now = Date.now();
    this.requests.push(now);
    this.saveToStorage();
  }

  getRemainingRequests() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - this.requests.length);
  }

  getTimeUntilReset() {
    if (this.requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...this.requests);
    const resetTime = oldestRequest + this.windowMs;
    const now = Date.now();
    
    return Math.max(0, resetTime - now);
  }

  reset() {
    this.requests = [];
    this.windowStart = Date.now();
    this.saveToStorage();
    console.log('🔄 Rate limit reset');
  }

  getStats() {
    return {
      remaining: this.getRemainingRequests(),
      limit: this.maxRequests,
      resetIn: this.getTimeUntilReset(),
      resetInMinutes: Math.ceil(this.getTimeUntilReset() / 60000),
    };
  }
}

// Singleton instances
export const apiCache = new APICache(10, 5 * 60 * 1000); // 10 entries, 5 min TTL
export const rateLimiter = new RateLimiter(15, 60 * 60 * 1000); // 15 requests per hour
