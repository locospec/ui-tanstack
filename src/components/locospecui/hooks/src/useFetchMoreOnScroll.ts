import React, { useCallback, useEffect } from "react";

const DEFAULT_OFFSET = 200;

interface UseFetchMoreOnScrollInterface {
  containerRef: React.RefObject<HTMLDivElement | null>;
  fetchNextPage: () => void;
  isFetching: boolean;
  hasNextPage: boolean;
  offset?: number;
}

const useFetchMoreOnScroll = ({
  containerRef,
  fetchNextPage,
  isFetching,
  hasNextPage,
  offset = DEFAULT_OFFSET,
}: UseFetchMoreOnScrollInterface) => {
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        const isHidden =
          scrollHeight === 0 && scrollTop === 0 && clientHeight === 0;

        if (
          !isHidden &&
          scrollHeight - scrollTop - clientHeight < offset &&
          !isFetching &&
          hasNextPage
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, hasNextPage]
  );

  useEffect(() => {
    fetchMoreOnBottomReached(containerRef.current);
  }, [fetchMoreOnBottomReached]);

  return { fetchMoreOnBottomReached };
};

useFetchMoreOnScroll.displayName = "useFetchMoreOnScroll";

export { useFetchMoreOnScroll };
