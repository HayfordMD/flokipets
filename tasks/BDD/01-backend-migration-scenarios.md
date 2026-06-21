# BDD Task: Update Migration Scenarios for AWS Lambda

**Goal:** Update the Behavior-Driven Development documentation (`BDD.md` or equivalent) to reflect the architectural shift from local API routes to an AWS Lambda backend proxy.

**Requirements:**
1. Add scenarios describing the expected behavior of the system when interacting with the remote API Gateway.
2. Define failure scenarios: e.g., what should happen if the Lambda proxy is down, or if the `NCB_SECRET_KEY` is improperly configured.
3. Validate that existing functional scenarios (Authentication, Store, Explore) remain intact, but ensure the underlying test implementations use the updated `EXPO_PUBLIC_API_URL` rather than `/api`.
