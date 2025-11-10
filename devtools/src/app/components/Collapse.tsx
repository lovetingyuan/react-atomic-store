import type { PropsWithChildren } from "react";

export default function Collapse(
  props: PropsWithChildren<{ title: string; open?: boolean }>
) {
  return (
    <div className="collapse collapse-arrow bg-base-100 border-base-300 border">
      <input type="checkbox" defaultChecked={!!props.open} />
      <div className="collapse-title font-semibold text-sm">{props.title}</div>
      <div className="collapse-content text-sm">{props.children}</div>
    </div>
  );
}
