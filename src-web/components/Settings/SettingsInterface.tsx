import { type } from "@tauri-apps/plugin-os";
import { useFonts } from "@yaakapp-internal/fonts";
import { useLicense } from "@yaakapp-internal/license";
import type { EditorKeymap, Settings } from "@yaakapp-internal/models";
import { patchModel, settingsAtom } from "@yaakapp-internal/models";
import { useAtomValue } from "jotai";
import { useState } from "react";

import { activeWorkspaceAtom } from "../../hooks/useActiveWorkspace";
import { clamp } from "../../lib/clamp";
import { showConfirm } from "../../lib/confirm";
import { invokeCmd } from "../../lib/tauri";
import { CargoFeature } from "../CargoFeature";
import { Button } from "../core/Button";
import { Checkbox } from "../core/Checkbox";
import { Heading } from "../core/Heading";
import { Icon } from "../core/Icon";
import { Link } from "../core/Link";
import { Select } from "../core/Select";
import { HStack, VStack } from "../core/Stacks";

const NULL_FONT_VALUE = "__NULL_FONT__";

const fontSizeOptions = [
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
].map((n) => ({ label: `${n}`, value: `${n}` }));

const keymaps: { value: EditorKeymap; label: string }[] = [
  { value: "default", label: "默认" },
  { value: "vim", label: "Vim" },
  { value: "vscode", label: "VSCode" },
  { value: "emacs", label: "Emacs" },
];

export function SettingsInterface() {
  const workspace = useAtomValue(activeWorkspaceAtom);
  const settings = useAtomValue(settingsAtom);
  const fonts = useFonts();

  if (settings == null || workspace == null) {
    return null;
  }

  return (
    <VStack space={3} className="mb-4">
      <div className="mb-3">
        <Heading>界面</Heading>
        <p className="text-text-subtle">调整与用户界面相关的设置。</p>
      </div>
      <Select
        name="switchWorkspaceBehavior"
        label="打开工作区行为"
        size="sm"
        help="打开工作区时，应在当前窗口还是新窗口中打开？"
        value={
          settings.openWorkspaceNewWindow === true
            ? "new"
            : settings.openWorkspaceNewWindow === false
              ? "current"
              : "ask"
        }
        onChange={async (v) => {
          if (v === "current") await patchModel(settings, { openWorkspaceNewWindow: false });
          else if (v === "new") await patchModel(settings, { openWorkspaceNewWindow: true });
          else await patchModel(settings, { openWorkspaceNewWindow: null });
        }}
        options={[
          { label: "每次询问", value: "ask" },
          { label: "在当前窗口打开", value: "current" },
          { label: "在新窗口打开", value: "new" },
        ]}
      />
      <HStack space={2} alignItems="end">
        {fonts.data && (
          <Select
            size="sm"
            name="uiFont"
            label="界面字体"
            value={settings.interfaceFont ?? NULL_FONT_VALUE}
            options={[
              { label: "系统默认", value: NULL_FONT_VALUE },
              ...(fonts.data.uiFonts.map((f) => ({
                label: f,
                value: f,
              })) ?? []),
              // Some people like monospace fonts for the UI
              ...(fonts.data.editorFonts.map((f) => ({
                label: f,
                value: f,
              })) ?? []),
            ]}
            onChange={async (v) => {
              const interfaceFont = v === NULL_FONT_VALUE ? null : v;
              await patchModel(settings, { interfaceFont });
            }}
          />
        )}
        <Select
          hideLabel
          size="sm"
          name="interfaceFontSize"
          label="界面字体大小"
          defaultValue="14"
          value={`${settings.interfaceFontSize}`}
          options={fontSizeOptions}
          onChange={(v) => patchModel(settings, { interfaceFontSize: Number.parseInt(v, 10) })}
        />
      </HStack>
      <HStack space={2} alignItems="end">
        {fonts.data && (
          <Select
            size="sm"
            name="editorFont"
            label="编辑器字体"
            value={settings.editorFont ?? NULL_FONT_VALUE}
            options={[
              { label: "系统默认", value: NULL_FONT_VALUE },
              ...(fonts.data.editorFonts.map((f) => ({
                label: f,
                value: f,
              })) ?? []),
            ]}
            onChange={async (v) => {
              const editorFont = v === NULL_FONT_VALUE ? null : v;
              await patchModel(settings, { editorFont });
            }}
          />
        )}
        <Select
          hideLabel
          size="sm"
          name="editorFontSize"
          label="编辑器字体大小"
          defaultValue="12"
          value={`${settings.editorFontSize}`}
          options={fontSizeOptions}
          onChange={(v) =>
            patchModel(settings, { editorFontSize: clamp(Number.parseInt(v, 10) || 14, 8, 30) })
          }
        />
      </HStack>
      <Select
        leftSlot={<Icon icon="keyboard" color="secondary" />}
        size="sm"
        name="editorKeymap"
        label="编辑器键位映射"
        value={`${settings.editorKeymap}`}
        options={keymaps}
        onChange={(v) => patchModel(settings, { editorKeymap: v })}
      />
      <Checkbox
        checked={settings.editorSoftWrap}
        title="编辑器自动换行"
        onChange={(editorSoftWrap) => patchModel(settings, { editorSoftWrap })}
      />
      <Checkbox
        checked={settings.coloredMethods}
        title="请求方法高亮显示"
        onChange={(coloredMethods) => patchModel(settings, { coloredMethods })}
      />
      <CargoFeature feature="license">
        <LicenseSettings settings={settings} />
      </CargoFeature>

      <NativeTitlebarSetting settings={settings} />

      {type() !== "macos" && (
        <Checkbox
          checked={settings.hideWindowControls}
          title="隐藏窗口控制按钮"
          help="在 Windows 或 Linux 上隐藏关闭/最大化/最小化按钮"
          onChange={(hideWindowControls) => patchModel(settings, { hideWindowControls })}
        />
      )}
    </VStack>
  );
}

function NativeTitlebarSetting({ settings }: { settings: Settings }) {
  const [nativeTitlebar, setNativeTitlebar] = useState(settings.useNativeTitlebar);
  return (
    <div className="flex gap-1 overflow-hidden h-2xs">
      <Checkbox
        checked={nativeTitlebar}
        title="原生标题栏"
        help="使用操作系统标准标题栏和窗口控制按钮"
        onChange={setNativeTitlebar}
      />
      {settings.useNativeTitlebar !== nativeTitlebar && (
        <Button
          color="primary"
          size="2xs"
          onClick={async () => {
            await patchModel(settings, { useNativeTitlebar: nativeTitlebar });
            await invokeCmd("cmd_restart");
          }}
        >
          应用并重启
        </Button>
      )}
    </div>
  );
}

function LicenseSettings({ settings }: { settings: Settings }) {
  const license = useLicense();
  if (license.check.data?.status !== "personal_use") {
    return null;
  }

  return (
    <Checkbox
      checked={settings.hideLicenseBadge}
      title="隐藏个人使用标识"
      onChange={async (hideLicenseBadge) => {
        if (hideLicenseBadge) {
          const confirmed = await showConfirm({
            id: "hide-license-badge",
            title: "确认个人使用",
            confirmText: "确认",
            description: (
              <VStack space={3}>
                <p>你好 👋</p>
                <p>
                  Yaak 可免费用于个人项目和学习。 <strong>若用于工作场景，则需要购买许可。</strong>
                </p>
                <p>
                  许可费用有助于 Yaak 保持独立并可持续发展。{" "}
                  <Link href="https://yaak.app/pricing?s=badge">购买许可 →</Link>
                </p>
              </VStack>
            ),
            requireTyping: "个人使用",
            color: "info",
          });
          if (!confirmed) {
            return; // Cancel
          }
        }
        await patchModel(settings, { hideLicenseBadge });
      }}
    />
  );
}
