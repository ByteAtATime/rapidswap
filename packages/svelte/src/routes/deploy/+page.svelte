<script lang="ts">
  import { createScaffoldWriteContract } from "$lib/runes/scaffoldWriteContract.svelte";
  import { AddressInput } from "$lib/components/scaffold-eth/inputs";
  import type { Address } from "viem";
  import { goto } from "$app/navigation";

  const { writeContractAsync } = $derived.by(createScaffoldWriteContract("RapidSwapFactory"));

  let tokenAddress: Address | undefined = $state(undefined);

  const handleDeploy = async () => {
    if (!tokenAddress) return;

    await writeContractAsync({
      functionName: "deploySwap",
      args: [tokenAddress],
    });

    await goto("/");
  };
</script>

<div class="container mx-auto flex flex-grow flex-col items-center justify-center gap-y-8 px-4">
  <div class="w-full rounded-3xl bg-base-100 p-8">
    <h1 class="text-center text-3xl font-bold">Deploy RapidSwap Instance</h1>

    <div class="mx-auto max-w-sm text-center">
      Deploy a new RapidSwap instance to start swapping tokens!
    </div>

    <label>
      Token Address
      <AddressInput placeholder="Token Address" bind:address={tokenAddress} />
    </label>

    <button class="btn btn-primary mt-4 w-full" disabled={!tokenAddress} on:click={handleDeploy}
      >Deploy</button
    >
  </div>
</div>
