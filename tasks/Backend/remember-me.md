# Backend Tasks: Remember Me Button

## Description
Update the authentication API to handle the "Remember Me" flag and issue session tokens with appropriate expiration times.

## KANBAN TODOS

- [ ] **API Update**: Update the `/api/auth/sign-in/email` endpoint to parse the `rememberMe` boolean from the request body.
- [ ] **Token Expiration Logic**:
  - If `rememberMe` is `true`: Set the session token/cookie to expire after a long period (e.g., 30 days).
  - If `rememberMe` is `false`: Set the session token/cookie to be a session cookie (expires when the browser closes) or a short duration (e.g., 24 hours).
- [ ] **Validation**: Ensure the `rememberMe` field is properly validated and sanitized.
- [ ] **Security**: Ensure that even with a long-lived token, security best practices are followed (e.g., token revocation capabilities, secure cookie flags: HttpOnly, Secure, SameSite).
