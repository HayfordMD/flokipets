# Backend Task: Implement NoCodeBackend Catch-All Proxy Lambda

**Goal:** Write the Node.js Lambda function handler that accurately proxies all requests (auth, data, public-data, pets, store, etc.) to NoCodeBackend, replicating the logic currently handled by the Next.js/Expo local API routes.

**Requirements:**
1. Create `backend/lib/functions/nocodebackend-proxy.ts`.
2. Inspect the requested path and query parameters to determine whether the request is destined for the `NCB_AUTH_API_URL` or `NCB_DATA_API_URL`.
3. Construct the proper upstream URL. Ensure `Instance` query parameter is always appended.
4. Pass headers securely:
   - Add `X-Database-Instance` header.
   - Include `Authorization: Bearer <NCB_SECRET_KEY>` for all data requests.
   - Forward cookies from the client request.
5. Forward the body payload properly.
6. When returning the response, handle `Set-Cookie` correctly: strip `Domain`, `Secure`, and `__Secure-` attributes to ensure localhost compatibility for the frontend. Handle the `rememberMe` custom cookie extension if applicable.
