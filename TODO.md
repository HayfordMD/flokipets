# FlokiPets TODOs

> **Note:** We have a database table named `fake_user_floki` in our NoCode Backend specifically set up to safely track fake Floki balances for testing.

## Games (Slot Machine)
- [ ] Create AWS Lambda function to handle the secure Slot Machine spinning logic.
- [ ] Connect the Lambda to the `43023_flokipets` NoCode database.
- [ ] Create the `CasinoBank` table in the database to track the global house edge and jackpot.
- [ ] Connect the local React Native `<SlotMachine />` UI to the live AWS Lambda endpoint.
- [ ] Test the integration using the `fake_user_floki` database table.

## App Architecture
- [ ] Set up user wallet connection and authentication (Google/Email) via the NoCode database.
- [ ] Move the Slot Machine game from the `/(dev)/slots` testing route into the main production `AppTabs` navigation once the backend is hooked up.

## Design & UI
- [ ] Integrate a real-time crypto price API (like CoinGecko) into the "How to Play" modal for accurate Floki USD pricing.
