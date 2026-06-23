// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Generator is AccessControl {
    using SafeERC20 for IERC20;

    IERC20 public immutable flokiToken;

    event GasDeposited(address indexed depositor, uint256 amount);
    event FlokiDeposited(address indexed depositor, uint256 amount);
    event FlokiConverted(address indexed to, uint256 amount);

    constructor(address _flokiToken) {
        require(_flokiToken != address(0), "Invalid token address");
        flokiToken = IERC20(_flokiToken);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Allows anyone to deposit BNB (Gas) into the Vault.
     */
    function depositGas() external payable {
        require(msg.value > 0, "Must deposit more than 0");
        emit GasDeposited(msg.sender, msg.value);
    }

    /**
     * @dev Allows anyone to deposit Floki into the Vault.
     * Note: The user must have approved this contract to spend their Floki beforehand.
     * @param amount The amount of Floki to deposit.
     */
    function depositFloki(uint256 amount) external {
        require(amount > 0, "Must deposit more than 0");
        flokiToken.safeTransferFrom(msg.sender, address(this), amount);
        emit FlokiDeposited(msg.sender, amount);
    }

    /**
     * @dev Allows the admin to send on-chain Floki to a user.
     * This is used when a user converts off-chain Floki to on-chain Floki.
     * @param to The user's wallet address.
     * @param amount The amount of Floki to transfer.
     */
    function convertFloki(address to, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");
        
        uint256 balance = flokiToken.balanceOf(address(this));
        require(balance >= amount, "Insufficient Floki in Vault");

        flokiToken.safeTransfer(to, amount);
        emit FlokiConverted(to, amount);
    }

    /**
     * @dev Allows admin to withdraw accidentally sent ERC20 tokens.
     */
    function emergencyWithdrawToken(address token, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        IERC20(token).safeTransfer(msg.sender, amount);
    }

    /**
     * @dev Allows admin to withdraw BNB (Gas) if needed.
     */
    function emergencyWithdrawGas(uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(address(this).balance >= amount, "Insufficient BNB balance");
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
    }
}
