type RateLimitStore = Map<string, { count: number; resetTime: number }>;

const inMemoryStore: RateLimitStore = new Map();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

const defaultConfig: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 1000,
};

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = defaultConfig
): Promise<RateLimitResult> {
  const now = Date.now();
  const key = identifier;

  const existing = inMemoryStore.get(key);

  if (!existing || now > existing.resetTime) {
    inMemoryStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  if (existing.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: existing.resetTime,
    };
  }

  existing.count += 1;
  inMemoryStore.set(key, existing);

  return {
    success: true,
    remaining: config.maxRequests - existing.count,
    resetTime: existing.resetTime,
  };
}

export const rateLimitConfigs = {
  donorRegistration: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000,
  },
  bloodRequest: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000,
  },
  contactForm: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000,
  },
  adminLogin: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  },
} as const;

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of inMemoryStore.entries()) {
    if (now > value.resetTime) {
      inMemoryStore.delete(key);
    }
  }
}, 60 * 1000);
