import { patchModel, settingsAtom } from "@yaakapp-internal/models";
import { Heading, HStack, Icon, type IconProps, VStack } from "@yaakapp-internal/ui";
import { useAtomValue } from "jotai";
import { lazy, Suspense } from "react";
import { activeWorkspaceAtom } from "../../hooks/useActiveWorkspace";
import { useResolvedAppearance } from "../../hooks/useResolvedAppearance";
import { useResolvedTheme } from "../../hooks/useResolvedTheme";
import type { ButtonProps } from "../core/Button";
import { IconButton } from "../core/IconButton";
import { Link } from "../core/Link";
import type { SelectProps } from "../core/Select";
import {
  ModelSettingRowSelect,
  SettingRowSelect,
  SettingsList,
  SettingsSection,
} from "../core/SettingRow";

const Editor = lazy(() => import("../core/Editor/Editor").then((m) => ({ default: m.Editor })));

const buttonColors: ButtonProps["color"][] = [
  "primary",
  "info",
  "success",
  "notice",
  "warning",
  "danger",
  "secondary",
  "default",
];

const icons: IconProps["icon"][] = [
  "info",
  "box",
  "update",
  "alert_triangle",
  "arrow_big_right_dash",
  "download",
  "copy",
  "magic_wand",
  "settings",
  "trash",
  "sparkles",
  "pencil",
  "paste",
  "search",
  "send_horizontal",
];

export function SettingsTheme() {
  const workspace = useAtomValue(activeWorkspaceAtom);
  const settings = useAtomValue(settingsAtom);
  const appearance = useResolvedAppearance();
  const activeTheme = useResolvedTheme();

  if (settings == null || workspace == null || activeTheme.data == null) {
    return null;
  }

  const lightThemes: SelectProps<string>["options"] = activeTheme.data.themes
    .filter((theme) => !theme.dark)
    .map((theme) => ({
      label: theme.label,
      value: theme.id,
    }));

  const darkThemes: SelectProps<string>["options"] = activeTheme.data.themes
    .filter((theme) => theme.dark)
    .map((theme) => ({
      label: theme.label,
      value: theme.id,
    }));

  return (
    <VStack space={1.5} className="mb-4">
      <div className="mb-3">
        <Heading>主题</Heading>
        <p className="text-text-subtle">
          选择主题自定义应用外观，或{" "}
          <Link href="https://yaak.app/docs/plugin-development/plugins-quick-start">
            创建自定义主题
          </Link>
        </p>
      </div>
      <SettingsList className="space-y-8">
        <SettingsSection title="主题">
          <ModelSettingRowSelect
            model={settings}
            modelKey="appearance"
            title="外观模式"
            description="选择跟随系统外观或使用固定模式。"
            options={[
              { label: "自动", value: "system" },
              { label: "浅色", value: "light" },
              { label: "深色", value: "dark" },
            ]}
          />
          {(settings.appearance === "system" || settings.appearance === "light") && (
            <SettingRowSelect
              name="lightTheme"
              title="浅色主题"
              description="浅色模式下使用的主题。"
              value={activeTheme.data.light.id}
              options={lightThemes}
              onChange={(themeLight) => patchModel(settings, { themeLight })}
            />
          )}
          {(settings.appearance === "system" || settings.appearance === "dark") && (
            <SettingRowSelect
              name="darkTheme"
              title="深色主题"
              description="深色模式下使用的主题。"
              value={activeTheme.data.dark.id}
              options={darkThemes}
              onChange={(themeDark) => patchModel(settings, { themeDark })}
            />
          )}
        </SettingsSection>

        <SettingsSection title="预览">
          <VStack
            space={3}
            className="mt-4 w-full bg-surface p-3 border border-dashed border-border-subtle rounded overflow-x-auto"
          >
            <HStack className="text" space={1.5}>
              <Icon icon={appearance === "dark" ? "moon" : "sun"} />
              <strong>{activeTheme.data.active.label}</strong>
              <em>(预览)</em>
            </HStack>
            <HStack space={1.5} className="w-full">
              {buttonColors.map((c, i) => (
                <IconButton
                  key={c}
                  color={c}
                  size="2xs"
                  iconSize="xs"
                  icon={icons[i % icons.length] ?? "info"}
                  iconClassName="text"
                  title={`${c}`}
                />
              ))}
              {buttonColors.map((c, i) => (
                <IconButton
                  key={c}
                  color={c}
                  variant="border"
                  size="2xs"
                  iconSize="xs"
                  icon={icons[i % icons.length] ?? "info"}
                  iconClassName="text"
                  title={`${c}`}
                />
              ))}
            </HStack>
            <Suspense>
              <Editor
                defaultValue={[
                  "let foo = { // 代码编辑器演示",
                  '  foo: ("bar" || "baz" ?? \'qux\'),',
                  "  baz: [1, 10.2, null, false, true],",
                  "};",
                ].join("\n")}
                heightMode="auto"
                language="javascript"
                stateKey={null}
              />
            </Suspense>
          </VStack>
        </SettingsSection>
      </SettingsList>
    </VStack>
  );
}
