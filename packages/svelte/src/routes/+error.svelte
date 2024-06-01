<script lang="ts">
  import { page } from "$app/stores";
  import { ArrowLeft, Icon } from "svelte-hero-icons";
</script>

<div class="flex flex-grow flex-col items-center justify-center">
  <h1 class="text-6xl font-bold">{$page.status}</h1>

  <p class="text-2xl">{$page.error.message}</p>

  <a href="/" class="btn btn-primary"><Icon src={ArrowLeft} class="h-6 w-6" /> Go Home</a>
</div>
