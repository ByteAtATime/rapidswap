import type { Address } from "viem";

export type Instance = {
  id: number;
  swapAddress: Address;
  token: {
    id: Address;
    name: string;
    symbol: string;
  };
};

export type InstanceResponse = {
  id: string;
  swapAddress: Address;
  token: {
    id: Address;
    name: string;
    symbol: string;
  };
};

export const GET_INSTANCES = `
query GetInstances($skip: Int, $first: Int, $search: String) {
  swapInstances(
    first: $first
    skip: $skip
    where: {token_: {or: [{symbol_contains_nocase: $search}, {name_contains_nocase: $search}]}}
  ) {
    id
    swapAddress
    token {
      id
      name
      symbol
    }
  }
}`;

export type GetInstancesResponse = {
  swapInstances: InstanceResponse[];
};

export const GET_INSTANCE = `
query GetInstance($id: ID!) {
  swapInstance(id: $id) {
    id
    swapAddress
    token {
      id
      name
      symbol
    }
  }
}`;

export type GetInstanceResponse = {
  swapInstance: InstanceResponse;
};
