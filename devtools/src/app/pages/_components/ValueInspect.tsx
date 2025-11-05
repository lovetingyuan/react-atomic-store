import { Icon } from "@iconify/react";
import { useStore, useStoreMeta } from "../../store";
import CodeBlock from "../../components/CodeBlock";
import CopyButton from "../../components/CopyButton";
import Collapse from "../../components/Collapse";

export default function CurrentValue(props: { storeName: string }) {
  const { initialValues, currentValues } = useStore();
  const sourceCode = JSON.stringify(currentValues[props.storeName], null, 2);
  const initCode = JSON.stringify(initialValues[props.storeName], null, 2);
  const storeMeta = useStoreMeta();
  return (
    <div className="space-y-3 p-2">
      <div className="flex items-center gap-1">
        <Icon icon="material-symbols-light:frame-source-rounded" width={20} />
        <code>{storeMeta?.source}</code>
        <CopyButton content={storeMeta?.source} tipClassname="tooltip-right" />
      </div>
      <Collapse title={"Initial value"}>
        <CodeBlock code={initCode} readonly />
      </Collapse>
      <Collapse title={"Current value"} open>
        <CodeBlock code={sourceCode} readonly />
      </Collapse>
    </div>
  );
}
