import { createStore } from "react-atomic-store";

export const { useStore, subscribeStore } = createStore("appStore", {
  /**
   * count value
   */
  count: 188,
  foo: {
    foo1: 1,
    foo2: 2,
  },
});

subscribeStore(({ key, value, oldValue }) => {
  console.log("store change:", key, value, oldValue);
});
