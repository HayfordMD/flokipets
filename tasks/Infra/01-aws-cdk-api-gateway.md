# Infra Task: Deploy Catch-All API Gateway and Lambda for NoCodeBackend Proxy

**Goal:** Create a unified AWS API Gateway and a catch-all Lambda function within the existing `backend` CDK project to replace the Expo local API proxy routes.

**Requirements:**
1. Update `backend/lib/backend-stack.ts` to provision an AWS API Gateway (HTTP API).
2. Provision a new Node.js Lambda function (`backend/lib/functions/nocodebackend-proxy.ts`).
3. Connect the Lambda function as a proxy integration to the API Gateway to capture all routes (e.g. `/{proxy+}`).
4. Pass the required environment variables to the Lambda function:
   - `NCB_INSTANCE`
   - `NCB_AUTH_API_URL`
   - `NCB_DATA_API_URL`
   - `NCB_SECRET_KEY`
5. Expose the API Gateway URL as a CloudFormation Output so the frontend can consume it.
