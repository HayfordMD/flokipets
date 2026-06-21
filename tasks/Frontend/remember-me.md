# Frontend Tasks: Remember Me Button

## Description
Implement a "Remember Me" checkbox on the login page (`src/app/index.tsx`) to allow users to maintain their session.

## KANBAN TODOS

- [ ] **Design/UI**: Add a checkbox component labelled "Remember me" below the password input field.
- [ ] **State Management**: Add a `rememberMe` boolean state variable in `src/app/index.tsx` initialized to `false`.
- [ ] **API Integration**: Update the `handleEmailAuth` function to include `rememberMe` in the POST request body sent to `/api/auth/sign-in/email`.
- [ ] **Persistence**: (Optional but recommended) Persist the `rememberMe` preference in local storage so it defaults to the user's previous choice on next visit.
- [ ] **Accessibility**: Ensure the checkbox is fully accessible (has correct ARIA labels, focus states, and can be toggled via keyboard).
