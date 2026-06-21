# Frontend Tasks: Dashboard UI

## Objective
Implement UI/UX improvements to the pet dashboard as outlined in the dashboard features plan.

## Tasks
- [ ] Update `src/app/dashboard.tsx` navigation grid:
  - Change the "Game" button to "Games" and update the route from `/game` to `/games`.
  - Add a new "Inventory" button routing to `/inventory`.
- [ ] Build Pet Status progress bars (Hunger, Happiness, Energy) and integrate them below the `<BasePet />` component.
- [ ] Build a User Profile Overview widget (User Level, Rank) and integrate it next to the FLOKI balance in the header.
- [ ] Create placeholder routes/screens for `/games.tsx` and `/inventory.tsx`.

## Dependencies
- Backend must provide schema/API for fetching Pet Status and User Rank/Level.
