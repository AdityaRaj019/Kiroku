---
name: performance-optimization
description: Guidelines for code performance tuning, caching strategies, database optimizations, N+1 query fixes, and event loop management
---

# Instructions

- **Prevent N+1 Queries:** Never query the database within a loop. Always aggregate lookup IDs and fetch related models in a single batch query (e.g., using `JOIN` in SQL, or `include`/`select` options in ORMs like Prisma).
- **Caching Strategy:** Layer caching to offload expensive computations and database accesses. Use in-memory caches (e.g., LRU Cache) for static configuration data and distributed memory stores (e.g., Redis) for high-read session data or user profiles.
- **Event Loop Protection (Node.js):** Never block the single-threaded Node.js event loop with long-running, synchronous CPU operations (e.g., parsing massive JSON strings, cryptography, image processing). Offload CPU-heavy operations to worker threads or background job queues.
- **Stream Processing:** Process large files, CSV reports, or database exports using streams or batch chunks. Do not read large contents into memory buffers at once.
- **Database Query Tuning:** Analyze database query performance using `EXPLAIN ANALYZE`. Ensure indexes cover fields used in filter joins and ordering.

# Gotchas

- **Memory Leaks in Closures:** Retaining large object references inside long-lived event listeners or intervals prevents the garbage collector from reclaiming memory.
- **Unindexed Queries:** Querying tables containing millions of rows on unindexed fields results in full-table scans that exhaust database resources.
- **Cache Invalidation Failures:** Caching dynamic data without specifying appropriate Time-To-Live (TTL) values or clear invalidation routines leads to stale client states.

# Validation Loops

1.  **Metric Profiling:** Wrap calculations in performance timers (`performance.now()`) inside a sandbox script to measure latency and runtime differences.
2.  **Query Log Auditing:** Enable database logging (e.g., setting Prisma `log: ['query']`) to inspect the total count of database queries executed during a single request.
3.  **Memory Profile Check:** Run the sandbox script with `--inspect` flags and trace heap allocation sizes to verify memory stabilizes after processing finishes.
