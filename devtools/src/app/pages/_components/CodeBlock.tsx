import { Icon } from "@iconify/react";
import { Activity, useEffect, useRef, useState } from "react";
import { codeToHtml } from "shiki";

const iconSize = "70%";

export default function CodeBlock(props: {
  code: string;
  className?: string;
  readonly?: boolean;
  onSave?: (code: string) => void;
}) {
  const [codeHtml, setCodeHtml] = useState("");
  const [editing, setEditing] = useState(false);
  const editingCodeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    codeToHtml(props.code, {
      lang: "json",
      theme: "one-light",
      transformers: [
        {
          pre(node) {
            this.addClassToHast(node, "p-3 rounded-sm overflow-auto");
          },
        },
      ],
    }).then((html) => {
      setCodeHtml(html);
    });
  }, [props.code]);
  return (
    <section className="relative">
      <Activity mode={editing ? "hidden" : "visible"}>
        <div
          className={props.className}
          dangerouslySetInnerHTML={{
            __html: codeHtml,
          }}
        ></div>
      </Activity>
      <Activity mode={!editing ? "hidden" : "visible"}>
        <div>
          <pre
            className="p-3 border rounded-sm bg-amber-50"
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
                    props.onSave?.(eval(`(0,${code})`));
                    setTimeout(() => {
                      setEditing(false);
                    }, 300);
                  } catch (err) {
                    alert("code error, " + err);
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
