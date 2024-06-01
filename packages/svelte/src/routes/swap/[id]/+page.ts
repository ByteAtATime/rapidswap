import type { PageLoad } from "./$types";
import { env } from "$env/dynamic/public";
import { GET_INSTANCE, type GetInstanceResponse } from "$lib/subgraph";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ params }) => {
  const { id } = params;

  const res = await fetch(env.PUBLIC_SUBGRAPH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_INSTANCE,
      variables: { id },
    }),
  });

  const { data } = (await res.json()) as { data: GetInstanceResponse };

  if (!data?.swapInstance) {
    error(404, "Swap instance not found");
  }

  return {
    instance: data.swapInstance,
    id,
  };
};
