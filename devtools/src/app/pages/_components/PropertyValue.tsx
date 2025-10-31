import { Link } from "react-router";
import { useStore } from "../../store";
import { wsClient } from "../../ws";
// import Editor from "@monaco-editor/react";
import CodeBlock from "./CodeBlock";

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
        </summary>
        <div className="collapse-content text-sm">
          <CodeBlock code={JSON.stringify(initValue, null, 2)} readonly />
          <button
            className="btn btn-soft btn-sm float-right my-4"
            onClick={() => {
              wsClient?.send(
                JSON.stringify({
                  action: "reset-store-property",
                  payload: {
                    storeName: props.storeName,
                    keyName: props.keyName,
                  },
                  source: "devtools",
                }),
              );
            }}
          >
            reset to initial value
          </button>
        </div>
      </details>
      <details
        className="collapse block collapse-arrow bg-base-100 border-base-300 border"
        open
      >
        <summary className="collapse-title font-semibold text-sm select-none">
          Current value
        </summary>
        <div className="collapse-content text-sm">
          {/*<div className="mockup-code w-full">
            <pre>
              <code>{JSON.stringify(currentValue, null, 2)}</code>
            </pre>
          </div>*/}
          {/*<Editor
            height="20vh"
            defaultLanguage="javascript"
            value={"(" + JSON.stringify(currentValue, null, 2) + ")"}
          />*/}
          <CodeBlock
            code={JSON.stringify(currentValue, null, 2)}
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
                }),
              );
            }}
          />
        </div>
      </details>
      <details className="collapse block collapse-arrow bg-base-100 border-base-300 border">
        <summary className="collapse-title font-semibold text-sm select-none">
          Component usage
        </summary>
        <div className="collapse-content text-sm">
          <ul>
            {deps?.length ? (
              deps.map((c) => {
                return (
                  <li key="c">
                    <code>{c}</code>
                  </li>
                );
              })
            ) : (
              <p className="opacity-70">No usage found</p>
            )}
          </ul>
        </div>
      </details>
    </div>
  );
}
