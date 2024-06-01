<script lang="ts">
  import { Address } from "$lib/components/scaffold-eth";
  import { createTransactor } from "$lib/runes/transactor.svelte";
  import { createSendTransaction } from "@byteatatime/wagmi-svelte";
  import { parseEther } from "viem";

  const { data } = $props();

  const { instance, id } = data;

  let amount = $state("");

  const sendTx = $derived.by(createTransactor());
  const { sendTransactionAsync } = $derived.by(createSendTransaction());

  const handleSend = async () => {
    const write = () =>
      sendTransactionAsync({
        to: instance.swapAddress,
        value: parseEther(amount),
      });
    sendTx(write);
  };
</script>

<div class="container mx-auto flex flex-grow flex-col items-center justify-center gap-y-8 px-4">
  <h1 class="text-3xl font-bold">RapidSwap Instance #{id}</h1>

  <div class="flex gap-x-2 text-xl text-gray-600 dark:text-gray-400">
    Swap Address:
    <span class="text-base-content">
      <Address address={instance.swapAddress} size="xl" />
    </span>
  </div>

  <div class="flex flex-col items-center">
    <div class="flex gap-x-2 text-xl text-gray-600 dark:text-gray-400">
      Token:
      <span class="text-base-content">
        {instance.token.name} ({instance.token.symbol})
      </span>
    </div>
    <Address address={instance.token.id} />
  </div>

  <div class="rounded-2xl bg-base-100 p-8">
    <h2 class="text-xl font-bold">Try it out!</h2>

    <form class="join w-full" on:submit|preventDefault={handleSend}>
      <input
        type="text"
        class="input join-item input-bordered w-full"
        placeholder="Amount"
        bind:value={amount}
      />
      <button class="btn btn-primary join-item">Swap</button>
    </form>

    <div class="divider">OR</div>

    <div class="max-w-sm">
      Simply send some ether to the contract, and it'll be swapped for you!
    </div>
  </div>
</div>
