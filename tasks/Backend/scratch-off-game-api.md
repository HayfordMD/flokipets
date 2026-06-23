# Backend Sprint Task: Scratch Off Game API & Payouts

## Objective
Create the secure backend logic for handling Scratch Off game plays, determining payouts, and processing the house/user fund splits.

## Requirements
- [ ] Create a new endpoint `POST /api/games/scratch-off` in the NocodeBackend / Lambda stack.
- [ ] Validate the incoming request and ensure the user's wallet address is provided.
- [ ] Process the play cost distribution:
  - 50% of the play amount must be processed as a payout back to the playing wallet.
  - The remaining 50% must be routed to the House/Admin wallet: `0x036512B25B7b0ac0D7DDdcAEA74ADF55e9A91365`.
- [ ] Implement the Web3 transaction logic using ethers.js or web3.js on the Live BNB Network.
- [ ] Read the House Admin Private Key securely from the `.env` variables to sign the transaction.
- [ ] Log the transaction hashes, user wallet address, play amount, and payout amounts in the database.
- [ ] Return the outcome securely to the frontend so it can render the scratch result.

## Notes
- We are running live on the BNB network. Ensure gas fee calculations are accounted for and the `.env` configuration contains live mainnet RPC endpoints.
