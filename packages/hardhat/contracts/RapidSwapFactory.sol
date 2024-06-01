// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./SwapInstance.sol";

contract RapidSwapFactory {
  address public immutable UNISWAP_ROUTER;
  address public immutable WETH;

  SwapDeployment[] public deployments;

  struct SwapDeployment {
    uint256 id;
    address swapAddress;
    address token;
  }

  event SwapDeployed(
    uint256 indexed id,
    address indexed token,
    address swapAddress
  );

  constructor(address _uniswapRouter, address _weth) {
    UNISWAP_ROUTER = _uniswapRouter;
    WETH = _weth;
  }

  function deploySwap(address _token) external {
    uint256 id = deployments.length;

    SwapInstance swap = new SwapInstance(id, UNISWAP_ROUTER, address(WETH), _token);

    deployments.push(SwapDeployment({
      id: id,
      swapAddress: address(swap),
      token: _token
    }));

    emit SwapDeployed(id, _token, address(swap));
  }
}
