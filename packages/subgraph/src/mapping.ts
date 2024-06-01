import { SwapInstance, Token } from "../generated/schema";
import { SwapDeployed } from "../generated/RapidSwapFactory/RapidSwapFactory";
import { Bytes } from "@graphprotocol/graph-ts";
import { ERC20 } from "../generated/RapidSwapFactory/ERC20";

export function handleSwapDeployed(event: SwapDeployed): void {
  const tokenAddress = event.params.token;
  const tokenId = Bytes.fromHexString(tokenAddress.toHexString());

  let token = Token.load(tokenId);

  if (token == null) {
    token = new Token(tokenId);

    const erc20 = ERC20.bind(tokenAddress);
    token.name = erc20.name();
    token.symbol = erc20.symbol();
    token.decimals = erc20.decimals().toI32();
  }

  const swapInstance = new SwapInstance(event.params.id.toString());

  swapInstance.deployer = event.transaction.from;
  swapInstance.deployedAt = event.block.timestamp;
  swapInstance.swapAddress = Bytes.fromHexString(
    event.params.swapAddress.toHexString(),
  );
  swapInstance.token = token.id;

  swapInstance.save();
  token.save();
}
