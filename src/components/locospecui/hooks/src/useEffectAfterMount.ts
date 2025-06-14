import { useEffect, useRef } from "react";

const useEffectAfterMount = (effect: () => void, deps: any[]) => {
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) {
      effect();
    } else {
      hasMounted.current = true;
    }
  }, deps);
};
useEffectAfterMount.displayName = "useEffectAfterMount";

export { useEffectAfterMount };
