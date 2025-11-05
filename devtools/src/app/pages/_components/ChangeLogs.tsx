import { getStoreMethods, useStore } from "../../store";
import { Icon } from "@iconify/react";
import { cn, im } from "../../utils";
import { AllStoreName } from "../../constant";
import CodeBlock from "../../components/CodeBlock";

const switchRecording = (storeName: string) => {
  const { setChangeLogs, setAllChangeLogsRecording } = getStoreMethods();
  if (storeName === AllStoreName) {
    setAllChangeLogsRecording((v) => !v);
    return;
  }
  setChangeLogs(
    im((logs) => {
      if (!logs[storeName]) {
        return;
      }
      logs[storeName].recording = !logs[storeName].recording;
    })
  );
};

export default function ChangeLogs(props: { storeName: string }) {
  const {
    changeLogs,
    setChangeLogs,
    allChangeLogs,
    allChangeLogsRecording,
    setAllChangeLogs,
  } = useStore();
  const isAll = props.storeName === AllStoreName;
  const { list, recording } = isAll
    ? {
        list: allChangeLogs,
        recording: allChangeLogsRecording,
      }
    : changeLogs[props.storeName] || {};

  return (
    <ul className="p-4 pt-2 bg-base-100 space-y-3">
      <li className="pb-2 tracking-wide flex justify-between w-[90%]">
        <div>
          <Icon
            icon="material-symbols-light:manage-history"
            className="inline align-sub mr-2"
            width={20}
          />
          <span>Change history list:</span>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              switchRecording(props.storeName);
            }}
            className={cn(
              "tooltip tooltip-left btn btn-ghost btn-xs btn-square font-normal",
              !recording && "hidden"
            )}
            data-tip="click to stop record"
          >
            <Icon
              className="text-red-500"
              width="16"
              icon="material-symbols-light:stop-circle"
            ></Icon>
          </button>
          <button
            onClick={() => {
              switchRecording(props.storeName);
            }}
            className={cn(
              "tooltip tooltip-left btn btn-ghost btn-xs btn-square font-normal",
              recording && "hidden"
            )}
            data-tip="click to start record"
          >
            <Icon
              className="text-gray-500"
              width="16"
              icon="material-symbols-light:screen-record"
            ></Icon>
          </button>
          <button
            className="tooltip tooltip-left font-normal btn btn-square btn-ghost btn-xs"
            data-tip="clear logs"
            disabled={!list.length}
            onClick={() => {
              if (props.storeName === AllStoreName) {
                setAllChangeLogs([]);
                return;
              }
              setChangeLogs(
                im((logs) => {
                  if (logs[props.storeName]) {
                    logs[props.storeName].list.length = 0;
                  }
                })
              );
            }}
          >
            <Icon
              icon="material-symbols-light:cleaning-services"
              width={14}
              height={14}
            ></Icon>
          </button>
        </div>
      </li>

      {list?.length ? (
        list.map(({ changeInfo, storeName, timestamp }, i) => {
          // Format the timestamp as a readable string
          const readableTime = timestamp
            ? new Date(timestamp).toLocaleTimeString()
            : "";
          return (
            <li key={i + storeName + changeInfo.key}>
              <div className="text-base font-bold my-2">
                {isAll ? storeName + " / " + changeInfo.key : changeInfo.key}
                <time className="font-normal text-xs text-gray-500 select-none italic">
                  {readableTime}
                </time>
              </div>

              <div className=" flex">
                <CodeBlock
                  code={JSON.stringify(changeInfo.oldValue, null, 2)}
                  readonly
                  className="flex-1 min-w-0"
                ></CodeBlock>
                <div className="divider divider-horizontal select-none">
                  <Icon
                    icon="material-symbols-light:line-end-arrow-rounded"
                    className=" shrink-0"
                    width={24}
                  />
                </div>
                <CodeBlock
                  code={JSON.stringify(changeInfo.value, null, 2)}
                  readonly
                  className="flex-1 min-w-0"
                ></CodeBlock>
              </div>
            </li>
          );
        })
      ) : (
        <li className="list-row font-thin text-sm">
          <div>
            No changes.
            {!recording && (
              <p className="my-2">
                click
                <Icon
                  className="text-gray-500 inline mx-1"
                  width="16"
                  icon="material-symbols-light:screen-record"
                ></Icon>
                to start record.
              </p>
            )}
          </div>
        </li>
      )}
    </ul>
  );
}
