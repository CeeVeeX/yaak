import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { patchModel, settingsAtom } from "@yaakapp-internal/models";
import { Heading, VStack } from "@yaakapp-internal/ui";
import { useAtomValue } from "jotai";
import { activeWorkspaceAtom } from "../../hooks/useActiveWorkspace";
import { useCheckForUpdates } from "../../hooks/useCheckForUpdates";
import { appInfo } from "../../lib/appInfo";
import {
  SETTING_FOLLOW_REDIRECTS,
  SETTING_REQUEST_TIMEOUT,
  SETTING_SEND_COOKIES,
  SETTING_STORE_COOKIES,
  SETTING_VALIDATE_CERTIFICATES,
} from "../../lib/requestSettings";
import { revealInFinderText } from "../../lib/reveal";
import { CargoFeature } from "../CargoFeature";
import { IconButton } from "../core/IconButton";
import {
  ModelSettingRowBoolean,
  ModelSettingRowNumber,
  ModelSettingSelectControl,
  SettingValue,
  SettingRow,
  SettingRowBoolean,
  SettingRowSelect,
  SettingsList,
  SettingsSection,
} from "../core/SettingRow";

export function SettingsGeneral() {
  const workspace = useAtomValue(activeWorkspaceAtom);
  const settings = useAtomValue(settingsAtom);
  const checkForUpdates = useCheckForUpdates();

  if (settings == null || workspace == null) {
    return null;
  }

  return (
    <VStack space={1.5} className="mb-4">
      <div className="mb-4">
        <Heading>常规</Heading>
        <p className="text-text-subtle">配置更新行为及其他通用设置。</p>
      </div>
      <SettingsList className="space-y-8">
        <CargoFeature feature="updater">
          <SettingsSection title="更新">
            <SettingRow title="更新通道" description="选择使用稳定版或测试版更新。">
              <div className="grid grid-cols-[12rem_auto] gap-1">
                <ModelSettingSelectControl
                  model={settings}
                  modelKey="updateChannel"
                  label="更新通道"
                  selectClassName="!w-full"
                  options={[
                    { label: "稳定版", value: "stable" },
                    { label: "测试版", value: "beta" },
                  ]}
                />
                <IconButton
                  variant="border"
                  size="sm"
                  title="检查更新"
                  icon="refresh"
                  spin={checkForUpdates.isPending}
                  onClick={() => checkForUpdates.mutateAsync()}
                />
              </div>
            </SettingRow>

            <SettingRowSelect
              title="更新方式"
              description="选择自动安装或手动安装更新。"
              name="autoupdate"
              value={settings.autoupdate ? "auto" : "manual"}
              onChange={(v) => patchModel(settings, { autoupdate: v === "auto" })}
              options={[
                { label: "自动", value: "auto" },
                { label: "手动", value: "manual" },
              ]}
            />

            <ModelSettingRowBoolean
              model={settings}
              modelKey="autoDownloadUpdates"
              title="自动下载更新"
              description="在后台下载更新，以便随时安装。"
              disabled={!settings.autoupdate}
            />

            <ModelSettingRowBoolean
              model={settings}
              modelKey="checkNotifications"
              title="检查通知"
              description="定期连接服务器检查相关通知。"
            />

            <SettingRowBoolean
              title="发送匿名使用统计"
              description="本软件优先本地运行，不会收集分析数据或使用信息。"
              disabled
              checked={false}
              onChange={() => {}}
            />
          </SettingsSection>
        </CargoFeature>

        <SettingsSection
          title={
            <>
              工作区{" "}
              <span className="inline-block bg-surface-highlight px-2 py-0.5 rounded text">
                {workspace.name}
              </span>
            </>
          }
        >
          <ModelSettingRowNumber
            model={workspace}
            modelKey={SETTING_REQUEST_TIMEOUT.modelKey}
            title={SETTING_REQUEST_TIMEOUT.title}
            description={SETTING_REQUEST_TIMEOUT.description}
            placeholder={`${SETTING_REQUEST_TIMEOUT.defaultValue}`}
            required
            validate={(value) => Number.parseInt(value, 10) >= 0}
          />

          <ModelSettingRowBoolean
            model={workspace}
            modelKey={SETTING_VALIDATE_CERTIFICATES.modelKey}
            title={SETTING_VALIDATE_CERTIFICATES.title}
            description={SETTING_VALIDATE_CERTIFICATES.description}
          />

          <ModelSettingRowBoolean
            model={workspace}
            modelKey={SETTING_FOLLOW_REDIRECTS.modelKey}
            title={SETTING_FOLLOW_REDIRECTS.title}
            description={SETTING_FOLLOW_REDIRECTS.description}
          />

          <ModelSettingRowBoolean
            model={workspace}
            modelKey={SETTING_SEND_COOKIES.modelKey}
            title={SETTING_SEND_COOKIES.title}
            description={SETTING_SEND_COOKIES.description}
          />

          <ModelSettingRowBoolean
            model={workspace}
            modelKey={SETTING_STORE_COOKIES.modelKey}
            title={SETTING_STORE_COOKIES.title}
            description={SETTING_STORE_COOKIES.description}
          />
        </SettingsSection>

        <SettingsSection title="应用信息">
          <SettingRow title="版本" description="当前软件版本。">
            <SettingValue value={appInfo.version} />
          </SettingRow>
          <SettingRow
            title="数据目录"
            description="应用数据的存储位置。"
            controlClassName="min-w-0 max-w-[min(42rem,55vw)] gap-2"
          >
            <SettingValue
              value={appInfo.appDataDir}
              actions={[
                {
                  title: revealInFinderText,
                  icon: "folder_open",
                  onClick: () => revealItemInDir(appInfo.appDataDir),
                },
              ]}
            />
          </SettingRow>
          <SettingRow
            title="日志目录"
            description="应用日志的写入位置。"
            controlClassName="min-w-0 max-w-[min(42rem,55vw)] gap-2"
          >
            <SettingValue
              value={appInfo.appLogDir}
              actions={[
                {
                  title: revealInFinderText,
                  icon: "folder_open",
                  onClick: () => revealItemInDir(appInfo.appLogDir),
                },
              ]}
            />
          </SettingRow>
        </SettingsSection>
      </SettingsList>
    </VStack>
  );
}
