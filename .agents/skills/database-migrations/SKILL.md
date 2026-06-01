---
name: database-migrations
description: Guidelines for database migrations, schema changes, schema generation, table definitions, indexing, and transactional integrity
---

# Instructions

- **Zero-Downtime Schema Evolution:** Never make breaking changes (like renaming or deleting columns) directly. Use the Expand-and-Contract pattern:
  1.  _Expand:_ Add the new column and write to both columns in application code.
  2.  _Backfill:_ Migrate historical data from the old column to the new column.
  3.  _Read:_ Update application code to read from the new column.
  4.  _Contract:_ Deprecate and eventually drop the old column.
- **Reversible Changes:** Every migration must be accompanied by a revert/rollback strategy. Write both the `up` and `down` migration logic.
- **Index Optimizations:** Create indexes for all foreign keys, unique constraints, and fields used regularly in `WHERE`, `JOIN`, and `ORDER BY` operations.
- **Transactional Execution:** Run all database updates within a transaction so that if any step fails, the database reverts to its original clean state.
- **Schema Syncing:** Keep ORM models (e.g., Prisma Schema, Mongoose Schemas) perfectly in sync with the database migrations. Regenerate client drivers (`prisma generate`) immediately after a migration is created.

# Gotchas

- **Locking Large Tables:** Adding non-nullable columns with default values or performing changes on indexed columns can lock large tables in production, causing service outage. Run large backfills in batches, not in the migration transaction.
- **Out-of-Sync Schema Files:** Bypassing migrations to perform direct database adjustments will cause runtime errors and out-of-sync local testing environments.
- **Nullable Field Errors:** Forgetting to handle null states in the application code after adding a nullable column will lead to server errors when older rows are retrieved.

# Validation Loops

1.  **Dry-Run Validation:** Execute the migration on a local scratch database container.
2.  **Rollback Check:** Run the migration down/rollback step and verify that the database structure reverts to the exact previous state.
3.  **Generate Driver Types:** Run the ORM client generation tool and compile the codebase to verify type alignment.
4.  **Integration Test:** Execute a simple CRUD integration test to ensure the database layer behaves correctly with the updated schema.
