import { Activity, useEffect } from "react";

import { useStore } from "../store";
import StorePanel from "./_components/StorePanel";
import { wsClient } from "../ws";
import clsx from "clsx";

function App() {
  const { initialValues, setActiveStoreName, activeStoreName } = useStore();
  useEffect(() => {
    const keys = Object.keys(initialValues);
    if (keys.length) {
      setActiveStoreName((n) => {
        return n || keys[0];
      });
    }
  }, [initialValues, setActiveStoreName]);

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
              }),
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
        {stores.map((name, i) => {
          return (
            <a
              role="tab"
              key={name + i}
              onClick={() => {
                setActiveStoreName(name);
              }}
              className={clsx(
                "tab px-4",
                activeStoreName === name && "tab-active",
              )}
            >
              {name}
            </a>
          );
        })}
      </div>
      <div className="overflow-auto">
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
