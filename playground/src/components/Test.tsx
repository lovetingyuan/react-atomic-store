import { useStore } from '../store';

export default function Test() {
  const { count } = useStore();
  return <div>test: {count}</div>;
}
