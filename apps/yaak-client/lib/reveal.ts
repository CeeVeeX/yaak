import { type } from "@tauri-apps/plugin-os";

const os = type();
export const revealInFinderText =
  os === "macos"
    ? "Reveal in Finder"
    : os === "windows"
      ? "在资源管理器中打开"
      : "在文件管理器中打开";
