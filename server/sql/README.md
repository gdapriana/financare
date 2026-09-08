# FinanCare SQL

This directory contains the versioned PostgreSQL migrations for FinanCare.

## Files

- `migrations/000001_initial_schema.up.sql` creates the complete MVP schema.
- `migrations/000001_initial_schema.down.sql` removes the complete MVP schema.
- `tests/initial_schema_smoke.sql` verifies key constraints without retaining
  test data.

The migration includes:

- users and refresh-token sessions;
- accounts and the transaction ledger;
- generated expense item totals;
- Cloudinary media metadata;
- profile image and transaction attachment relationships;
- ownership constraints, search indexes, and timestamp triggers.

## Apply manually

Run the up migration against an empty development database:

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 \
  -f server/sql/migrations/000001_initial_schema.up.sql
```

Roll it back:

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 \
  -f server/sql/migrations/000001_initial_schema.down.sql
```

Run the smoke test after applying the up migration:

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 \
  -f server/sql/tests/initial_schema_smoke.sql
```

The migration is also compatible with migration tools that use the conventional
`*.up.sql` and `*.down.sql` filename format.

## Application-owned invariants

The following cross-row rules must be enforced by the Go service inside a
database transaction:

- an expense must contain at least one item;
- `transactions.amount` for an expense must equal the sum of its generated
  `expense_items.line_total` values;
- only an active account owned by the authenticated user may be used;
- no more than five active attachments may be linked to a transaction;
- only a completed Cloudinary upload owned by the authenticated user may be
  linked as a profile image or transaction attachment;
- changing the primary profile image must clear the previous primary image in
  the same database transaction;
- deleting a Cloudinary asset must be coordinated with database state and only
  finalized after Cloudinary confirms deletion.

Money is stored in whole Rupiah with `BIGINT`. Timestamps use `TIMESTAMPTZ`, and
the API should exchange them as RFC 3339 values.
