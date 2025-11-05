import { Activity } from "react";
import { useStoreMeta } from "../../store";
import SideMenu from "./SideMenu";
import ValueInspect from "./ValueInspect";
import ChangeLogs from "./ChangeLogs";
import { AllStoreName, MenuName } from "../../constant";
import PropertyValue from "./PropertyValue";

export default function StorePanel(props: { storeName: string }) {
  const storeMeta = useStoreMeta();

  if (props.storeName === AllStoreName) {
    return <ChangeLogs storeName={AllStoreName} />;
  }
  if (!storeMeta) {
    return null;
  }
  const { activeMenu } = storeMeta;
  return (
    <div className="bg-base-100 border-base-300">
      <div className="flex gap-2">
        <SideMenu></SideMenu>
        <div className="flex-1 min-w-40">
          <Activity
            mode={activeMenu === MenuName.storeValue ? "visible" : "hidden"}
          >
            <ValueInspect storeName={props.storeName} />
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
