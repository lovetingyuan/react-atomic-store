import { Icon } from "@iconify/react";
import { useState } from "react";
import { cn } from "../../utils";

export default function CopyButton(props: {
  content: string;
  btnClassname?: string;
}) {
  const [copied, setCopied] = useState(false);
  const iconSize = "70%";

  return (
    <div
      className="tooltip ml-2 tooltip-right"
      data-tip={copied ? "copied" : "copy"}
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
