// import { openUrl } from "@tauri-apps/plugin-opener";
import { useRef } from "react";
import { openSettings } from "../commands/openSettings";
import { useCheckForUpdates } from "../hooks/useCheckForUpdates";
import { useExportData } from "../hooks/useExportData";
import { appInfo } from "../lib/appInfo";
import { showDialog } from "../lib/dialog";
import { importData } from "../lib/importData";
import type { DropdownRef } from "./core/Dropdown";
import { Dropdown } from "./core/Dropdown";
import { Icon } from "@yaakapp-internal/ui";
import { IconButton } from "./core/IconButton";
import { KeyboardShortcutsDialog } from "./KeyboardShortcutsDialog";

export function SettingsDropdown() {
  const exportData = useExportData();
  const dropdownRef = useRef<DropdownRef>(null);
  const checkForUpdates = useCheckForUpdates();
  // const { check } = useLicense();

  return (
    <Dropdown
      ref={dropdownRef}
      items={[
        {
          label: "设置",
          hotKeyAction: "settings.show",
          leftSlot: <Icon icon="settings" />,
          onSelect: () => openSettings.mutate(null),
        },
        {
          label: "键盘快捷键",
          hotKeyAction: "hotkeys.showHelp",
          leftSlot: <Icon icon="keyboard" />,
          onSelect: () => {
            showDialog({
              id: "hotkey",
              title: "Keyboard Shortcuts",
              size: "dynamic",
              render: () => <KeyboardShortcutsDialog />,
            });
          },
        },
        {
          label: "插件",
          leftSlot: <Icon icon="puzzle" />,
          onSelect: () => openSettings.mutate("plugins"),
        },
        { type: "separator", label: "共享工作空间" },
        {
          label: "导入数据",
          leftSlot: <Icon icon="folder_input" />,
          onSelect: () => importData.mutate(),
        },
        {
          label: "导出数据",
          leftSlot: <Icon icon="folder_output" />,
          onSelect: () => exportData.mutate(),
        },
        // {
        //   label: "创建运行按钮",
        //   leftSlot: <Icon icon="rocket" />,
        //   onSelect: () => openUrl("https://yaak.app/button/new"),
        // },
        { type: "separator", label: `版本 ${appInfo.version}` },
        {
          label: "Check for Updates",
          leftSlot: <Icon icon="update" />,
          hidden: !appInfo.featureUpdater,
          onSelect: () => checkForUpdates.mutate(),
        },
        // {
        //   label: "Purchase License",
        //   color: "success",
        //   hidden: check.data == null || check.data.status === "active",
        //   leftSlot: <Icon icon="circle_dollar_sign" />,
        //   rightSlot: <Icon icon="external_link" color="success" className="opacity-60" />,
        //   onSelect: () => openUrl("https://yaak.app/pricing"),
        // },
        // {
        //   label: "Install CLI",
        //   hidden: appInfo.cliVersion != null,
        //   leftSlot: <Icon icon="square_terminal" />,
        //   rightSlot: <Icon icon="external_link" color="secondary" />,
        //   onSelect: () => openUrl("https://yaak.app/docs/cli"),
        // },
        // {
        //   label: "Feedback",
        //   leftSlot: <Icon icon="chat" />,
        //   rightSlot: <Icon icon="external_link" color="secondary" />,
        //   onSelect: () => openUrl("https://yaak.app/feedback"),
        // },
        // {
        //   label: "Changelog",
        //   leftSlot: <Icon icon="cake" />,
        //   rightSlot: <Icon icon="external_link" color="secondary" />,
        //   onSelect: () => openUrl(`https://yaak.app/changelog/${appInfo.version}`),
        // },
      ]}
    >
      <IconButton
        size="sm"
        title="Main Menu"
        icon="settings"
        iconColor="secondary"
        className="pointer-events-auto"
      />
    </Dropdown>
  );
}
