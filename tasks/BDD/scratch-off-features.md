# BDD Sprint Task: Scratch Off Game Features

## Objective
Define the Behavioral Driven Development features for the Scratch Off Game.

## Features

```gherkin
Feature: Scratch Off Game Play and Payout

  Scenario: A user plays the scratch off game
    Given the user has connected their Web3 wallet
    And the network is set to live BNB
    When the user plays the scratch off game with an amount of X BNB
    Then exactly 50% of X should be transferred to the user's wallet as a payout
    And exactly 50% of X should be transferred to the house wallet "0x036512B25B7b0ac0D7DDdcAEA74ADF55e9A91365"
    And the frontend should display a scratch-off animation revealing the payout amount
```
