import { useEffectAfterMount } from "./useEffectAfterMount";

const useDebouncedEffectAfterMount = (
  effect: () => void,
  deps: any[],
  delay: number
) => {
  useEffectAfterMount(() => {
    const handler = setTimeout(() => {
      effect();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...deps, delay]);
};

useDebouncedEffectAfterMount.displayName = "useDebouncedEffectAfterMount";

export { useDebouncedEffectAfterMount };
