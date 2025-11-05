import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { create } from "mutative";
import ErrorStackParser from "error-stack-parser";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function im<T>(callback: (v: T) => void) {
  return (oldValue: T) => {
    return create(oldValue, callback);
  };
}

export function parseStackTrace(
  stack: string,
  type: "store" | "property" | "mutation"
) {
  const err = new Error();
  err.stack = stack;
  const parsed = ErrorStackParser.parse(err);

  let filePath = "";
  let functionName = "unknown";

  const assignFromFrame = (frame?: {
    fileName?: string;
    functionName?: string;
  }) => {
    if (frame?.fileName) {
      filePath = new URL(frame.fileName).pathname;
      functionName = frame.functionName || "anonymous";
    }
  };

  switch (type) {
    case "store":
    case "mutation": {
      assignFromFrame(parsed[1]);
      break;
    }
    case "property": {
      const markers = [
        "react_stack_bottom_frame",
        "react-stack-bottom-frame",
        "renderWithHooks",
      ];
      const index = parsed.findIndex((v) => {
        const name = v.functionName || "";
        return markers.some((m) => name.includes(m));
      });
      if (index > 1) {
        assignFromFrame(parsed[index - 1]);
      }
      break;
    }
  }

  return {
    filePath,
    functionName,
  };
}
