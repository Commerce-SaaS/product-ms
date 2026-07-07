/**
 * Prometheus metrics for products-ms.
 *
 * WHY a separate file?
 * --------------------
 * This module is imported by both CacheService and ProductsService, and also by
 * main.ts to start the HTTP server. Node.js modules are singletons, so the same
 * `register`, `cacheHits`, etc. objects are shared across all importers — every
 * increment lands in the same in-process counter.
 *
 * WHY a plain http.Server instead of a Nest HTTP adapter?
 * -------------------------------------------------------
 * This app has NO HTTP server — it is bootstrapped with createMicroservice (RMQ).
 * Adding a full NestJS HTTP application alongside it is possible but heavy.
 * A 10-line http.Server is far easier to understand for a junior dev and has
 * no interaction with the RMQ transport.
 */
import * as http from 'http';
import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  Registry,
} from 'prom-client';
import { Logger } from '@nestjs/common';

// A single registry that owns all our metrics.
// Passing it explicitly to each metric makes it obvious where they all live.
export const register = new Registry();

// Default Node.js metrics: process CPU, heap used/total, RSS, GC durations,
// event-loop lag, active handles & requests.
// These come FREE from prom-client — no extra code needed in the service.
collectDefaultMetrics({ register });

// ---------------------------------------------------------------------------
// Cache counters
//
// These answer: "Is the cache doing its job?"
// A hit-rate of 100% means every read was served from Redis — the DB is idle.
// A drop in hit-rate after a deploy means the cache warmed up, watch for it.
//
// Labels:
//   entity    — segment from the Redis key (e.g. 'product', 'products',
//               'category', 'categories'). Singular = findOne key,
//               plural = findAll list key.
//   operation — 'findOne' or 'findAll' (derived from the key structure).
// ---------------------------------------------------------------------------
export const cacheHits = new Counter({
  name: 'products_ms_cache_hits_total',
  help: 'Cache hits: value found in Redis, DB was NOT queried.',
  labelNames: ['entity', 'operation'] as const,
  registers: [register],
});

export const cacheMisses = new Counter({
  name: 'products_ms_cache_misses_total',
  help: 'Cache misses: value not in Redis, DB WAS queried.',
  labelNames: ['entity', 'operation'] as const,
  registers: [register],
});

// ---------------------------------------------------------------------------
// DB query duration histogram
//
// Measures how long the real DB calls take when the cache misses.
// Only the catalog read path in ProductsService is wrapped (findOne + findAll).
// Write-path DB calls are not timed here — they always hit the DB anyway.
//
// Labels:
//   entity    — 'product' (only ProductsService uses this histogram today)
//   operation — 'findOne' or 'findAll'
//
// NOTE: if the DB call throws, the timer function is never called — failed
// queries are NOT recorded. This is acceptable for a learning setup; in
// production you'd use try/finally to always call end().
// ---------------------------------------------------------------------------
export const dbQueryDuration = new Histogram({
  name: 'products_ms_db_query_duration_seconds',
  help: 'Duration of catalog DB reads on cache miss (seconds).',
  labelNames: ['entity', 'operation'] as const,
  // Buckets: 5ms → 1s. Adjust if your p99 is consistently above 1s.
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
  registers: [register],
});

// ---------------------------------------------------------------------------
// Metrics HTTP server
//
// Called once from main.ts. Runs alongside the RabbitMQ microservice in the
// same Node.js process — the two do not interfere.
// Prometheus scrapes GET /metrics on METRICS_PORT (default 9100).
// ---------------------------------------------------------------------------
const logger = new Logger('MetricsServer');

export async function startMetricsServer(port: number): Promise<void> {
  const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/metrics') {
      // Content-Type tells Prometheus which text exposition format we're using.
      res.setHeader('Content-Type', register.contentType);
      res.end(await register.metrics());
    } else {
      res.statusCode = 404;
      res.end('Not found — only GET /metrics is served here.');
    }
  });

  // Listen on all interfaces (0.0.0.0) so Prometheus can reach us inside Docker.
  await new Promise<void>((resolve, reject) =>
    server.listen(port, '0.0.0.0', resolve).on('error', reject),
  );

  logger.log(
    `Metrics server listening on http://0.0.0.0:${port}/metrics (Prometheus scrape target)`,
  );
}
