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
    And the user should see a button linking to "/shop"
    And the user should see a button linking to "/game"
    And the user should see a button linking to "/marketplace"
    And the user should see a button linking to "/friends"
    And the user should see a button linking to "/bank"
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