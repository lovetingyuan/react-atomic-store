import { Icon } from "@iconify/react";
import { Activity, Suspense, use, useRef, useState } from "react";
import { codeToHtml } from "shiki";
import { cn } from "../utils";

const iconSize = "70%";

function ShikiCode(props: { task: Promise<string>; className?: string }) {
  const codeHtml = use(props.task);
  return (
    <div
      className={props.className}
      dangerouslySetInnerHTML={{
        __html: codeHtml,
      }}
    ></div>
  );
}

export default function CodeBlock(props: {
  code: string;
  className?: string;
  readonly?: boolean;
  onSave?: (code: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const editingCodeRef = useRef<HTMLPreElement>(null);
  const codeGen = codeToHtml(props.code || "loading...", {
    lang: "json",
    theme: "one-light",
    transformers: [
      {
        pre(node) {
          this.addClassToHast(node, "p-3 rounded-sm overflow-auto");
        },
      },
    ],
  });

  return (
    <section className={cn("relative", props.className)}>
      <Activity mode={editing ? "hidden" : "visible"}>
        <Suspense
          fallback={
            <span className="loading text-secondary loading-dots loading-sm m-3"></span>
          }
        >
          <ShikiCode
            task={codeGen}
            className="shadow-[0_0_5px_2px_#e5e5e5] rounded-md"
          />
        </Suspense>
      </Activity>
      <Activity mode={!editing ? "hidden" : "visible"}>
        <div>
          <pre
            className="p-3 border bg-amber-50"
            contentEditable
            spellCheck={false}
            autoFocus
            ref={(e) => {
              e?.focus();
              editingCodeRef.current = e;
            }}
            dangerouslySetInnerHTML={{
              __html: `<code>${props.code}</code>`,
            }}
          ></pre>
        </div>
      </Activity>
      <div
        className="absolute z-10 top-0.5 right-0.5"
        style={props.readonly ? { display: "none" } : undefined}
      >
        {editing ? (
          <div className="flex gap-1">
            <div className="tooltip" data-tip={"save"}>
              <button
                className={"btn btn-xs btn-square btn-ghost"}
                onClick={() => {
                  const code = editingCodeRef.current?.innerText.trim();
                  if (!code) {
                    return;
                  }
                  try {
                    // eslint-disable-next-line sonarjs/code-eval
                    props.onSave?.(eval(`(0,${code})`));
                    setEditing(false);
                  } catch (err) {
                    alert("code error\n" + err);
                  }
                }}
              >
                <Icon
                  icon="material-symbols-light:save-rounded"
                  width={iconSize}
                  height={iconSize}
                />
              </button>
            </div>
            <div className="tooltip" data-tip={"cancel"}>
              <button
                className={"btn btn-xs btn-square btn-ghost"}
                onClick={() => {
                  setEditing(false);
                }}
              >
                <Icon
                  icon="material-symbols-light:cancel-outline"
                  width={iconSize}
                  height={iconSize}
                />
              </button>
            </div>
          </div>
        ) : (
          <div className="tooltip" data-tip={"edit"}>
            <button
              className={"btn btn-xs btn-square btn-ghost"}
              onClick={() => {
                setEditing(true);
              }}
            >
              <Icon
                icon="material-symbols-light:edit-document"
                width={iconSize}
                height={iconSize}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
