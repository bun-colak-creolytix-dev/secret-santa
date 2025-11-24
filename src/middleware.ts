import { createMiddleware } from "@tanstack/react-start";
import { Redis } from "@upstash/redis";
import { env } from "@/env";

// Custom error for rate limiting
class RateLimitError extends Error {
	status: number;
	headers: Record<string, string>;
	constructor(message: string) {
		super(message);
		this.name = "RateLimitError";
		this.status = 429;
		this.headers = {};
	}
}

// Initialize Redis client if credentials are available
const redis =
	env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
		? new Redis({
				url: env.UPSTASH_REDIS_REST_URL,
				token: env.UPSTASH_REDIS_REST_TOKEN,
			})
		: null;

const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_WINDOW_SECONDS = 60;

export const rateLimitMiddleware = createMiddleware().server(
	async ({ request, next }) => {
		if (!redis) {
			console.log("No Redis configured, skipping rate limiting");
			return next();
		}

		const url = new URL(request.url);
		const method = request.method;
		const pathname = url.pathname;

		const endpointKey = `${method}:${pathname}`;
		const rateLimitKey = `rate-limit:${endpointKey}`;

		try {
			const count = await redis.incr(rateLimitKey);

			if (count === 1) {
				await redis.expire(rateLimitKey, RATE_LIMIT_WINDOW_SECONDS);
			}

			// Check if rate limit exceeded
			if (count > RATE_LIMIT_MAX_REQUESTS) {
				const error = new RateLimitError("Rate limit exceeded. Please try again later.");
				error.status = 429;
				error.headers = {
					"Content-Type": "application/json",
					"Retry-After": String(RATE_LIMIT_WINDOW_SECONDS),
				};
				throw error;
			}

			return next();
		} catch (error) {
			if (error instanceof RateLimitError) {
				throw error;
			}
			console.error("Rate limiting error:", error);
			return next();
		}
	},
);
