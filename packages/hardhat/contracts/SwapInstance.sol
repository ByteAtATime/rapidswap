// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SwapInstance {
  ISwapRouter02 public immutable UNISWAP_ROUTER;
  IWETH public immutable WETH;

  uint256 public immutable id;
  address public immutable token;

  constructor(uint256 _id, address _uniswap, address _weth, address _token) {
    id = _id;
    UNISWAP_ROUTER = ISwapRouter02(_uniswap);
    WETH = IWETH(_weth);

    token = _token;
  }

  fallback() external payable {
    WETH.deposit{value: msg.value}();
    WETH.approve(address(UNISWAP_ROUTER), msg.value);

    ISwapRouter02.ExactInputSingleParams memory params = ISwapRouter02.ExactInputSingleParams({
      tokenIn: address(WETH),
      tokenOut: token,
      fee: 3000,
      recipient: msg.sender,
      amountIn: msg.value,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0
    });

    UNISWAP_ROUTER.exactInputSingle(params);
  }
}

interface ISwapRouter02 {
  struct ExactInputSingleParams {
    address tokenIn;
    address tokenOut;
    uint24 fee;
    address recipient;
    uint256 amountIn;
    uint256 amountOutMinimum;
    uint160 sqrtPriceLimitX96;
  }

  function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);
}

interface IWETH is IERC20 {
  function deposit() external payable;
  function withdraw(uint256 amount) external;
}
