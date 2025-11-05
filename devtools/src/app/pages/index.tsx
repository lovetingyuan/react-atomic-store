import { Activity } from "react";

import { useStore } from "../store";
import StorePanel from "./_components/StorePanel";
import { wsClient } from "../ws";
import clsx from "clsx";
import { AllStoreName } from "../constant";

function TabItem(props: { tabName: string }) {
  const {
    setActiveStoreName,
    activeStoreName,
    changeLogs,
    allChangeLogsRecording,
  } = useStore();
  const recording =
    props.tabName === AllStoreName
      ? allChangeLogsRecording
      : changeLogs[props.tabName]?.recording;
  return (
    <a
      role="tab"
      onClick={() => {
        setActiveStoreName(props.tabName);
      }}
      className={clsx(
        "tab px-4",
        activeStoreName === props.tabName && "tab-active"
      )}
    >
      {props.tabName === AllStoreName ? "All Stores" : props.tabName}
      {recording && (
        <div className="inline-grid *:[grid-area:1/1] relative -top-0.5 left-0.5">
          <div className="status status-success animate-ping"></div>
          <div className="status status-success"></div>
        </div>
      )}
    </a>
  );
}

function App() {
  const { initialValues, activeStoreName } = useStore();

  const stores = Object.keys(initialValues);
  if (!stores.length) {
    return (
      <div className="p-10">
        <p>There is no stores, you can reload the connected app.</p>
        <button
          className="btn btn-primary mt-5"
          onClick={() => {
            wsClient?.send(
              JSON.stringify({
                action: "reload-app",
                payload: null,
                source: "devtools",
              })
            );
          }}
        >
          Reload App
        </button>
      </div>
    );
  }

  return (
    <>
      <div role="tablist" className="tabs tabs-sm tabs-box rounded-none">
        <TabItem tabName={AllStoreName} />
        {stores.map((name) => {
          return <TabItem tabName={name} key={name} />;
        })}
      </div>
      <div className="overflow-auto p-4">
        <Activity
          mode={AllStoreName === activeStoreName ? "visible" : "hidden"}
        >
          <StorePanel storeName={AllStoreName} />
        </Activity>
        {stores.map((name, i) => {
          return (
            <Activity
              mode={name === activeStoreName ? "visible" : "hidden"}
              key={name + i}
            >
              <StorePanel storeName={name} />
            </Activity>
          );
        })}
      </div>
    </>
  );
}

export default App;
