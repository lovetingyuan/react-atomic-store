import { Activity } from "react";
import { useStoreMeta } from "../../store";
import CopyButton from "./CopyButton";
import SideMenu from "./SideMenu";
import InitialValue from "./InitialValue";
import CurrentValue from "./CurrentValue";
import ChangeLogs from "./ChangeLogs";
import { MenuName } from "../../constant";
import PropertyValue from "./PropertyValue";

export default function StorePanel(props: { storeName: string }) {
  const storeMeta = useStoreMeta();
  if (!storeMeta) {
    return null;
  }
  const { source, activeMenu } = storeMeta;
  return (
    <div className="bg-base-100 border-base-300 p-4">
      <div className="mb-3">
        <code>{source}</code>
        <CopyButton content={source} />
      </div>
      <div className="flex gap-2">
        <SideMenu></SideMenu>
        <div className="flex-1 min-w-40">
          <Activity
            mode={activeMenu === MenuName.initStoreValue ? "visible" : "hidden"}
          >
            <InitialValue storeName={props.storeName} />
          </Activity>
          <Activity
            mode={
              activeMenu === MenuName.currentStoreValue ? "visible" : "hidden"
            }
          >
            <CurrentValue storeName={props.storeName} />
          </Activity>
          <Activity
            mode={activeMenu === MenuName.changeLogs ? "visible" : "hidden"}
          >
            <ChangeLogs storeName={props.storeName} />
          </Activity>
          <Activity
            mode={
              activeMenu?.startsWith(MenuName.properties) ? "visible" : "hidden"
            }
          >
            <PropertyValue
              keyName={activeMenu?.split(".")[1]}
              storeName={props.storeName}
            />
          </Activity>
        </div>
      </div>
    </div>
  );
}
