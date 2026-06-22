# Behavior Driven Development (BDD) Scenarios

## Feature: User Login Navigation
```gherkin
Feature: User Login Navigation
  As a registered user
  I want to be redirected to the dashboard upon logging in
  So that I can access my game features

  Scenario: Successful login redirects to dashboard
    Given the user is on the home screen
    When the user successfully logs in with valid credentials
    Then the user should be automatically routed to "/dashboard"

  Scenario: Login with Remember Me checked
    Given a user is on the login page
    When they enter valid credentials, check the "Remember me" box, and submit
    And they close their browser and reopen it
    Then they should still be logged in and redirected to the dashboard

  Scenario: Login without Remember Me checked
    Given a user is on the login page
    When they enter valid credentials, leave "Remember me" unchecked, and submit
    And they close their browser and reopen it
    Then their session should be expired and they should be prompted to log in again
```

## Feature: Dashboard Interface
```gherkin
Feature: Dashboard Interface
  As a logged-in user
  I want to see my pet and quick links on my dashboard
  So that I can easily navigate the app

  Scenario: Viewing the dashboard features
    Given the user is logged in
    When the user is on the "/dashboard" screen
    Then the user should see an image of their pet
    And the user should see their Pet Status (Hunger, Energy, Happiness)
    And the user should see their User Profile Summary (Rank, Level)
    And the user should see a button linking to "/shop"
    And the user should see a button linking to "/games"
    And the user should see a button linking to "/marketplace"
    And the user should see a button linking to "/friends"
    And the user should see a button linking to "/bank"
    And the user should see a button linking to "/inventory"
```

## Feature: Inventory Navigation
```gherkin
Feature: Inventory Navigation
  As a user
  I want to be able to navigate to my inventory
  And see my collected items

  Scenario: Navigating to inventory
    Given the user is on the dashboard
    When the user clicks the inventory button
    Then the user should be routed to "/inventory"
```

## Feature: Games Navigation and List
```gherkin
Feature: Games Navigation and List
  As a user
  I want to be able to navigate to the games section
  And see a list of all my games

  Scenario: Navigating to games
    Given the user is on the dashboard (or any screen with the games button)
    When the user clicks the games button
    Then the user should be routed to "/games"

  Scenario: Viewing the games list
    Given the user is on the "/games" screen
    Then the user should see a list of all their games
```

## Feature: AWS Lambda Backend Proxy
```gherkin
Feature: AWS Lambda Backend Proxy
  As a developer
  I want the frontend to route API requests through a unified AWS API Gateway
  So that the app can be fully decoupled from local Next.js API routes

  Scenario: Connecting to remote API Gateway
    Given the environment variable "EXPO_PUBLIC_API_URL" is set
    When the frontend makes a request to fetch data
    Then the request should be routed to the remote API Gateway instead of local "/api"
    And the AWS Lambda proxy should correctly forward the request to NoCodeBackend

  Scenario: Proxy failure when AWS Lambda is down
    Given the AWS Lambda proxy is currently experiencing downtime
    When the frontend makes an API request
    Then a 502 Bad Gateway or 503 Service Unavailable error should be returned
    And the application should display a user-friendly error message indicating backend connectivity issues

  Scenario: Proxy failure due to misconfigured Secret Key
    Given the "NCB_SECRET_KEY" environment variable is missing or incorrect in Lambda
    When the frontend attempts to fetch secured data
    Then the proxy should return a 500 Internal Server Error or 401 Unauthorized
    And the data fetch should fail securely without exposing sensitive variables
```