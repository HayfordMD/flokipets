# Infra Tasks: Remember Me Button

## Description
Ensure infrastructure supports long-lived sessions safely.

## KANBAN TODOS

- [ ] **Review Session Store**: If sessions are stored in a database or Redis, ensure that the TTL configuration can support longer durations (e.g., 30 days) for users who select "Remember Me".
- [ ] **Cookie Configurations**: Verify that proxy or CDN settings allow the appropriate caching and passing of long-lived secure cookies.
- [ ] **Cleanup**: Ensure there is an automated cleanup process for expired sessions in the database to prevent bloat.
