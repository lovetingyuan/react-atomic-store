import { useStore } from '../../store';

export function FooBar() {
  const { count } = useStore();
  return <p>foobar: {count}</p>;
}

export function FooBar2() {
  const { count } = useStore();
  return <p>foobar2: {count}</p>;
}
