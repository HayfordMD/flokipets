# Generator/Burner Smart Contract

**Status:** TODO

**Description:**
Develop a smart contract (Vault) on BSC that will act as the "Generator". Players can deposit gas (BNB) and Floki into this contract. The contract should also expose a function for the admin to execute on-chain mints/transfers to the players' wallets when converting off-chain Floki to on-chain Floki.

**Acceptance Criteria:**
- Contract deployed on BSC.
- `depositGas()` function that accepts BNB.
- `depositFloki()` function that accepts Floki tokens.
- `convertFloki()` function restricted to an admin role that mints/transfers real Floki to the player's wallet.
- Integration ready with Thirdweb.
