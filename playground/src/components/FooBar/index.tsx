import { useStore } from "../../store";

export default function FooBar() {
  const { count } = useStore();
  return <p>foobar: {count}</p>;
}
