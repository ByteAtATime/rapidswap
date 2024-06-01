<script lang="ts">
  import { createAccount } from "@byteatatime/wagmi-svelte";
  import { Icon, MagnifyingGlass } from "svelte-hero-icons";
  import { GET_INSTANCES, type GetInstancesResponse, type Instance } from "$lib/subgraph";
  import { page } from "$app/stores";
  import { Address } from "$lib/components/scaffold-eth";
  import { env } from "$env/dynamic/public";

  const INSTANCES_PER_PAGE = 10;
  const pageNumber = $derived(parseInt($page.url.searchParams.get("page") ?? 1));

  const { address } = $derived.by(createAccount());

  let instances: Instance[] | undefined = $state(undefined);
  let searchQuery = $state("");

  $effect(async () => {
    instances = undefined;

    const skip = (pageNumber - 1) * INSTANCES_PER_PAGE;

    const res = await fetch(env.PUBLIC_SUBGRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_INSTANCES,
        variables: { first: INSTANCES_PER_PAGE, skip, search: searchQuery },
      }),
    });

    const { data, ...rest } = (await res.json()) as { data: GetInstancesResponse };

    instances = data.swapInstances.map(instance => ({
      id: parseInt(instance.id),
      swapAddress: instance.swapAddress,
      token: {
        id: instance.token.id,
        name: instance.token.name,
        symbol: instance.token.symbol,
      },
    }));
  });
</script>

<div class="container mx-auto flex flex-grow flex-col items-center justify-center gap-y-8 px-4">
  <label class="input input-bordered flex items-center gap-2">
    <Icon src={MagnifyingGlass} class="h-6 w-6" />
    <input type="text" class="grow" placeholder="Search" bind:value={searchQuery} />
  </label>

  <a href="/deploy" class="btn btn-primary">Deploy a new instance</a>

  <div class="grid w-full grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8">
    {#if instances}
      {#each instances as instance}
        <a href={`/swap/${instance.id}`}>
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <div class="flex flex-col">
                <h2 class="card-title">{instance.token.name} ({instance.token.symbol})</h2>

                <Address address={instance.swapAddress} />
              </div>
            </div>
          </div>
        </a>
      {/each}
    {:else}
      {#each Array(INSTANCES_PER_PAGE) as _}
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex flex-col">
              <h2 class="card-title skeleton h-6 w-40" />
              <p class="skeleton mt-0 h-4 w-full"></p>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <div class="join">
    <a
      href={pageNumber > 1 && `?page=${pageNumber - 1}`}
      class="btn join-item"
      class:btn-disabled={pageNumber <= 1}
    >
      «
    </a>
    <button class="btn join-item">Page {pageNumber}</button>
    <a
      href={pageNumber > 1 && `?page=${pageNumber + 1}`}
      class="btn join-item"
      class:btn-disabled={pageNumber <= 1}
    >
      »
    </a>
  </div>
</div>
