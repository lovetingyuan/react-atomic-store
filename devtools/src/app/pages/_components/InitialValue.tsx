import { useStore } from "../../store";
import CodeBlock from "./CodeBlock";

export default function InitialValue(props: { storeName: string }) {
  const { initialValues } = useStore();
  const sourceCode = JSON.stringify(initialValues[props.storeName], null, 2);
  return <CodeBlock code={sourceCode} readonly />;
}
