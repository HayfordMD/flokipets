# Testing Tasks: Remember Me Button

## Description
Implement unit and integration tests for the "Remember Me" functionality.

## KANBAN TODOS

- [ ] **Frontend Unit Tests**: Write tests for `src/app/index.tsx` to verify that the "Remember Me" checkbox renders correctly.
- [ ] **Frontend Interaction Tests**: Write tests verifying that toggling the checkbox correctly updates the state.
- [ ] **Backend Unit Tests**: Write tests for the `/api/auth/sign-in/email` endpoint to verify that when `rememberMe` is true, the returned cookie/token has a long expiration.
- [ ] **Backend Integration Tests**: Verify that when `rememberMe` is false, the token expiration is short or session-based.
