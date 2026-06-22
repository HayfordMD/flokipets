Feature: Generator and Off-Chain to On-Chain Conversion
  As a player
  I want to interact with the Generator in the Marketplace
  So that I can donate gas or convert my in-game Floki to real Floki on the BSC blockchain.

  Scenario: A player donates gas to the Generator
    Given I am on the Generator page in the Marketplace
    When I click "Donate Gas"
    And I approve a transaction for 0.05 BNB through my wallet
    Then the Generator contract balance should increase by 0.05 BNB
    And my donation should be reflected in the UI

  Scenario: Admin processes an off-chain to on-chain conversion
    Given a player has 100 off-chain Floki in the database
    When the player requests a conversion to on-chain Floki
    Then the backend admin script triggers a Thirdweb contract call
    And the player's wallet receives 100 on-chain Floki
    And the database deducts the 100 off-chain Floki from their account
