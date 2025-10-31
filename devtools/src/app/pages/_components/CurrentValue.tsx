import { useStore } from "../../store";
// import { wsClient } from "../../ws";
import CodeBlock from "./CodeBlock";

export default function CurrentValue(props: { storeName: string }) {
  const { currentValues } = useStore();
  // const { activeMenu } = useStoreMeta();
  const sourceCode = JSON.stringify(currentValues[props.storeName], null, 2);
  return (
    <CodeBlock
      code={sourceCode}
      readonly
      // onSave={(code) => {
      //   console.log(999, "save", code);
      //   wsClient?.send(
      //     JSON.stringify({
      //       action: "change-store-property",
      //       payload: {
      //         storeName: props.storeName,
      //         keyName: activeMenu.split(".").pop(),
      //         value: code,
      //       },
      //       source: "devtools",
      //     }),
      //   );
      // }}
    />
  );
}
