import { useStore } from "../../store";

export function useAddCount() {
  const { setCount } = useStore();
  return (v) => {
    setCount(v);
  };
}
