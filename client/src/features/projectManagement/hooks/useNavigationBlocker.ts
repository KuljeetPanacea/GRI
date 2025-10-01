import { useContext, useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

type NavigationBlockerTx = { retry: () => void };

export function useNavigationBlocker(blocker: (tx: NavigationBlockerTx) => void, when = true) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;
    navigator.push = (...args: Parameters<typeof push>) => {
      blocker({ retry: () => push(...args) });
    };

    return () => {
      navigator.push = push;
    };
  }, [blocker, navigator, when]);
}