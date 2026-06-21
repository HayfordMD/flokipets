# Testing Task: Verify AWS Lambda Proxy Integration

**Goal:** Ensure the newly implemented AWS Lambda catch-all proxy correctly forwards requests to NoCodeBackend and handles responses properly.

**Requirements:**
1. Verify unit tests for the Lambda handler accurately simulate request/response mapping.
2. Confirm that the `NCB_SECRET_KEY` is securely attached to backend data calls and never exposed to the frontend.
3. Validate that `Set-Cookie` headers returned from NoCodeBackend have `Domain` and `Secure` attributes correctly stripped when responding to localhost environments.
4. Perform an end-to-end test using the Expo frontend pointing to the deployed API Gateway, verifying Sign Up, Sign In, and data retrieval (e.g. Dashboard pets) succeed.
