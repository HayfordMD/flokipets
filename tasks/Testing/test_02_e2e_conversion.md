# E2E Testing for Generator Floki Conversion

**Status:** TODO

**Description:**
Write end-to-end tests that simulate the full conversion flow: from database trigger, to admin script execution, to on-chain mint/transfer via Thirdweb.

**Acceptance Criteria:**
- Test script seeds the database with a pending conversion request.
- The admin worker executes the conversion.
- Verify the blockchain state on a local fork (e.g., Hardhat/Foundry) reflects the transfer.
- Verify the database marks the request as completed.
