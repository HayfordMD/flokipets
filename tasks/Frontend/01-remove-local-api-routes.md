# Frontend Task: Remove Local API Routes and Use Remote Backend

**Goal:** Decouple the Expo frontend from the local Next.js-style API routes so that the application can be built and run natively on mobile devices.

**Requirements:**
1. Delete the `src/app/api/` directory entirely since proxying will now be handled by AWS Lambda.
2. Search the codebase for all occurrences of `/api/` in `fetch` requests or networking utility functions.
3. Replace local `/api/` references with the new environment variable (e.g. `EXPO_PUBLIC_API_URL`). Wait for the Infra task to deploy the API Gateway and supply the URL.
4. Ensure `credentials: "include"` is maintained for all fetch calls so session cookies are forwarded to the remote AWS API Gateway.
