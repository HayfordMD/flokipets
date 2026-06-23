# Infra Sprint Task: Live BNB Env Config

## Objective
Update the deployment and runtime environment to support live BNB network transactions and securely store the House/Admin wallet keys.

## Requirements
- [ ] Configure the backend deployment scripts and `.env.template` to include `ADMIN_WALLET_PRIVATE_KEY` and `LIVE_BNB_RPC_URL`.
- [ ] Ensure the House Wallet `0x036512B25B7b0ac0D7DDdcAEA74ADF55e9A91365` is documented as the target for the 50% house split.
- [ ] Ensure the AWS Lambda / backend runtime environment properly injects these `.env` variables at runtime without exposing them to the frontend.
- [ ] Create a runbook for rotating the admin private key if necessary.
