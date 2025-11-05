import { Icon } from "@iconify/react";
import { memo, useState } from "react";
import { cn } from "../utils";

function CopyButton(props: {
  content: string;
  btnClassname?: string;
  tipText?: string;
  tipClassname?: string;
}) {
  const [copied, setCopied] = useState(false);
  const iconSize = "70%";

  return (
    <div
      className={cn("tooltip", props.tipClassname)}
      data-tip={copied ? "copied" : props.tipText || "copy"}
    >
      <button
        className={cn("btn btn-xs btn-square btn-ghost", props.btnClassname)}
        onClick={() => {
          if (copied) {
            return;
          }
          navigator.clipboard.writeText(props.content).then(() => {
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 1500);
          });
        }}
      >
        <Icon
          icon="material-symbols-light:content-copy"
          style={!copied ? { display: "none" } : undefined}
          width={iconSize}
          height={iconSize}
        />
        <Icon
          icon="material-symbols-light:content-copy-outline"
          style={copied ? { display: "none" } : undefined}
          width={iconSize}
          height={iconSize}
        />
      </button>
    </div>
  );
}
export default memo(CopyButton);
