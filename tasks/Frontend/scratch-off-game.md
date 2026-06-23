# Frontend Sprint Task: Scratch Off Game Integration

## Objective
Implement the Scratch Off Game UI in the React Native / Expo application by porting the `prototype/scratch_off.html` logic.

## Requirements
- [ ] Create a new React Native screen/component for the Scratch Off Game.
- [ ] Ensure the component connects to the user's Web3 wallet via the existing providers.
- [ ] Implement the UI to purchase/start a scratch card, prompting a Web3 transaction signature if necessary.
- [ ] Call the backend API endpoint (`POST /api/games/scratch-off`) passing the user's wallet address.
- [ ] Ensure the game canvas is locked/loading until the backend returns the result.
- [ ] Render the scratch effect using a React Native canvas or masking component.
- [ ] Display the total payout clearly after the user fully scratches the card.

## Notes
- The result must be determined purely by the backend response, not calculated on the client side.
