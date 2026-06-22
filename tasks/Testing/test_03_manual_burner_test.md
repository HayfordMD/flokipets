# Manual Live Testing for Gas Generator (Burner)

**Status:** TODO

**Description:**
Conduct manual, live testing of the Gas Generator (Burner) on a live or test network (e.g., BSC Testnet/Mainnet). Since we have access to all the necessary test wallets, we should deploy a real working version of the generator quickly to validate the end-to-end user experience and contract functionality in a live environment.

**Acceptance Criteria:**
- Deploy the Generator smart contract using the admin wallet via Thirdweb to the target network.
- Use a secondary wallet to manually deposit a small amount of "real" Gas (e.g., BNB) into the Burner to fund it.
- Use the game interface (or Thirdweb dashboard) to trigger the backend admin script to convert off-chain Floki to on-chain Floki for a test user.
- Verify that the on-chain Floki is successfully minted/transferred to the test user's wallet.
- Confirm that the gas used for the transaction is successfully paid for by the Gas Generator's pool.
- Document any friction points or UX issues encountered during this live test.
