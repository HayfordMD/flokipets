# Testing Sprint Task: Scratch Off Game Validation

## Objective
Write tests to ensure the 50/50 fund distribution for the Scratch Off game operates flawlessly and securely.

## Requirements
- [ ] Write unit tests for the backend payout calculation to strictly verify exactly 50% of the play amount is mapped to the payout, and 50% to the house wallet (`0x036512B25B7b0ac0D7DDdcAEA74ADF55e9A91365`).
- [ ] Write integration tests mocking the Live BNB RPC to verify transaction payloads are correctly structured before signing.
- [ ] Write E2E mock tests simulating the frontend API call and asserting the returned payload visually aligns with a successful scratch-off sequence.
