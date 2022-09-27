import { onCleanup, untrack, createRoot, createMemo } from "solid-js";

function repeatMap(count, mapFn) {
  let mapped = [],
    disposers = [],
    len = 0,
    i;

  onCleanup(() => {
    for (let i = 0; i < disposers.length; i++) disposers[i]();
  });
  return () => {
    const num = count() || 0;
    return untrack(() => {
      for (i = len; i < num; i++) mapped[i] = createRoot(mapper);
      for (i = num; i < len; i++) disposers[i]();
      len = disposers.length = num;
      return (mapped = mapped.slice(0, len));
    });
    function mapper(disposer) {
      disposers[i] = disposer;
      return mapFn(i);
    }
  };
}

export default function Repeat(props) {
  return createMemo(repeatMap(() => props.count, props.children));
}
