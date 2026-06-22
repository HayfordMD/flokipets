# Admin Conversion Sync Logic

**Status:** TODO

**Description:**
Create an admin script/backend worker that monitors the database for off-chain Floki balances. When a player wishes to convert their off-chain Floki to on-chain Floki, the backend will trigger a transaction via the Thirdweb SDK to call the Generator contract and transfer "real" Floki to the player.

**Acceptance Criteria:**
- Backend reads pending conversion requests from the database.
- Backend calls the `convertFloki()` function on the BSC Generator contract using Thirdweb's admin wallet.
- Database state is updated to reflect the deduction of off-chain Floki upon successful on-chain transaction.
