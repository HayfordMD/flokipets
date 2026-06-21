# BDD Tasks: Remember Me Button

## Description
Define behavior-driven development scenarios for the "Remember Me" feature.

## KANBAN TODOS

- [ ] **Update BDD.md**: Add new scenarios for the "Remember Me" feature.
- [ ] **Scenario 1**: 
  - **Given** a user is on the login page
  - **When** they enter valid credentials, check the "Remember me" box, and submit
  - **And** they close their browser and reopen it
  - **Then** they should still be logged in and redirected to the dashboard.
- [ ] **Scenario 2**: 
  - **Given** a user is on the login page
  - **When** they enter valid credentials, leave "Remember me" unchecked, and submit
  - **And** they close their browser and reopen it
  - **Then** their session should be expired and they should be prompted to log in again.
