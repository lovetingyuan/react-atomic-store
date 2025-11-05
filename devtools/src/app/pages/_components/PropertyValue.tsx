import { useStore } from "../../store";
import { wsClient } from "../../ws";
// import Editor from "@monaco-editor/react";
import CodeBlock from "../../components/CodeBlock";
import CopyButton from "../../components/CopyButton";
import Collapse from "../../components/Collapse";

export default function PropertyValue(props: {
  keyName: string;
  storeName: string;
}) {
  const { initialValues, currentValues, trackUsage } = useStore();
  const initValue = initialValues[props.storeName][props.keyName];
  const currentValue = currentValues[props.storeName][props.keyName];
  const deps = trackUsage[props.storeName]?.[props.keyName];
  return (
    <div className="space-y-2.5">
      <details className="collapse block collapse-arrow bg-base-100 border-base-300 border">
        <summary className="collapse-title font-semibold text-sm select-none">
          Initial value
          <button
            className="btn btn-soft btn-xs mx-5"
            onClick={() => {
              wsClient?.send(
                JSON.stringify({
                  action: "reset-store-property",
                  payload: {
                    storeName: props.storeName,
                    keyName: props.keyName,
                  },
                  source: "devtools",
                })
              );
            }}
          >
            reset to initial value
          </button>
        </summary>
        <div className="collapse-content text-sm">
          <CodeBlock code={JSON.stringify(initValue, null, 2)} readonly />
        </div>
      </details>
      <Collapse title={"Current value"}>
        <CodeBlock
          code={JSON.stringify(currentValue, null, 2)}
          readonly
          onSave={(data) => {
            wsClient?.send(
              JSON.stringify({
                action: "change-store-property",
                payload: {
                  storeName: props.storeName,
                  keyName: props.keyName,
                  value: data,
                },
                source: "devtools",
              })
            );
          }}
        />
      </Collapse>
      <Collapse title="Component usage">
        <ul className="list-disc list-inside">
          {deps?.length ? (
            deps.map((dep, i) => {
              return (
                <li key={i}>
                  <code>
                    {dep.filePath} (<i>{dep.functionName}</i>)
                  </code>
                  <CopyButton
                    content={dep.filePath}
                    tipText="copy file path"
                    tipClassname="ml-1 tooltip-top"
                  />
                </li>
              );
            })
          ) : (
            <p className="opacity-70">No usage found</p>
          )}
        </ul>
      </Collapse>
    </div>
  );
}
