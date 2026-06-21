# Backend Tasks: Dashboard API

## Objective
Update the backend schema and APIs to support the expanded pet dashboard features (Pet Status and User Inventory).

## Tasks
- [ ] Audit NoCode Backend schema to ensure tables track:
  - Pet Statistics (Hunger, Energy, Happiness levels and last updated timestamps).
  - User Inventory (Items owned, quantities).
- [ ] Create or update the necessary NoCode database tables for these features.
- [ ] Update `/api/data/` or `/api/public-data/` proxies if special RLS (Row Level Security) is needed for the new tables.

## Notes
Coordinate with the DBA team to ensure the new schemas are optimized.
