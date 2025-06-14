import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export interface UseInfiniteFetchParams {
  queryKey: string;
  searchQuery?: string;
  endpoint: string;
  dataCallback?: ({
    pageParam,
  }: {
    pageParam?: null | undefined;
  }) => Promise<any>;
  refreshDep?: (string | number | boolean)[];
  body?: Record<string, any>;
  headers?: Record<string, string>;
  keepPreviousData?: InfiniteData<any, unknown> | boolean;
  initialPageParam?: any; // Add this to the interface as well
}

const useInfiniteFetch = ({
  queryKey,
  searchQuery,
  endpoint,
  dataCallback,
  refreshDep,
  body = {},
  headers = {},
  keepPreviousData = true,
  initialPageParam = null, // Default to null if not provided
}: UseInfiniteFetchParams) => {
  // Validate required props
  if (!dataCallback && !endpoint) {
    throw new Error("Either 'dataCallback' or 'endpoint' must be provided");
  }

  // Default the refresh dependency to the query key and search query if not provided
  const dependencies = refreshDep ?? [queryKey, searchQuery];

  // Fetch data function if no dataCallback is provided
  const fetchDataFunction = async ({ pageParam = null }) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        pagination: {
          type: "cursor",
          per_page: 10,
          cursor: pageParam,
        },
        search: searchQuery,
        ...body,
      }),
    });

    const responseJson = await response.json();
    if (!Array.isArray(responseJson?.data)) {
      throw new Error("Expected 'data' to be an array");
    }

    return responseJson;
  };

  const { data, fetchNextPage, isFetching, hasNextPage, refetch } =
    useInfiniteQuery({
      queryKey: dependencies,
      queryFn: dataCallback || (fetchDataFunction as any),
      getNextPageParam: (lastPage: any) => lastPage.meta?.next_cursor,
      getPreviousPageParam: firstPage => firstPage.meta?.prev_cursor,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData as InfiniteData<any, unknown>,
      initialPageParam, // Add this property
    });

  // Memoize flat data across all pages
  const flatData = useMemo(
    () => data?.pages?.flatMap(page => page.data) ?? [],
    [data]
  );

  return { flatData, fetchNextPage, isFetching, hasNextPage, refetch };
};

useInfiniteFetch.displayName = "useInfiniteFetch";

export { useInfiniteFetch };
