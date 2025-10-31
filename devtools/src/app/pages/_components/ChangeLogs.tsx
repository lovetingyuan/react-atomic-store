import { useMemo } from "react";
import { useStore } from "../../store";
import { Icon } from "@iconify/react";
import { im } from "../../utils";

export default function ChangeLogs(props: { storeName: string }) {
  const { changeLogs, initialValues, setChangeLogs } = useStore();

  const maxLengthKey = useMemo(() => {
    const keys = Object.keys(initialValues[props.storeName]);
    let maxKey = "";
    for (const k of keys) {
      if (k.length > maxKey.length) {
        maxKey = k;
      }
    }
    return maxKey;
  }, [initialValues[props.storeName]]);

  return (
    <ul className="list bg-base-100">
      <li className="p-4 pb-2 text-xs tracking-wide">
        Change history list:
        <label className="swap text-xl">
          {/* this hidden checkbox controls the state */}
          <input type="checkbox" />

          <div className="swap-on">
            <Icon icon="material-symbols-light:screen-record"></Icon>
          </div>
          <div className="swap-off">😇</div>
        </label>
        <button
          className="tooltip ml-2 font-normal btn btn-square btn-soft btn-xs"
          data-tip="clear logs"
          onClick={() => {
            setChangeLogs(
              im((logs) => {
                if (logs[props.storeName]) {
                  logs[props.storeName].length = 0;
                }
              }),
            );
          }}
        >
          <Icon
            icon="material-symbols-light:cleaning-services"
            width={14}
            height={14}
          ></Icon>
        </button>
      </li>

      {changeLogs[props.storeName]?.length ? (
        changeLogs[props.storeName]?.map((changeInfo, i) => {
          return (
            <li className="list-row" key={i + changeInfo.key}>
              <div
                className="text-base font-bold"
                style={{
                  width: maxLengthKey.length + "em",
                }}
              >
                {changeInfo.key}
              </div>

              <div className="list-col-grow flex">
                <div className="card bg-base-300 rounded-box grid p-4 flex-1 min-w-0">
                  <pre>
                    <code>{JSON.stringify(changeInfo.oldValue, null, 2)}</code>
                  </pre>
                </div>
                <div className="divider divider-horizontal">TO</div>
                <div className="card bg-base-300 rounded-box grid p-4   flex-1  min-w-0">
                  <pre>
                    <code>{JSON.stringify(changeInfo.value, null, 2)}</code>
                  </pre>
                </div>
              </div>
            </li>
          );
        })
      ) : (
        <li className="list-row font-thin text-sm">no changes</li>
      )}
    </ul>
  );
}
