import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { patchModel, settingsAtom } from "@yaakapp-internal/models";
import { useAtomValue } from "jotai";
import { activeWorkspaceAtom } from "../../hooks/useActiveWorkspace";
import { useCheckForUpdates } from "../../hooks/useCheckForUpdates";
import { appInfo } from "../../lib/appInfo";
import { revealInFinderText } from "../../lib/reveal";
import { CargoFeature } from "../CargoFeature";
import { Checkbox } from "../core/Checkbox";
import { Heading } from "../core/Heading";
import { IconButton } from "../core/IconButton";
import { KeyValueRow, KeyValueRows } from "../core/KeyValueRow";
import { PlainInput } from "../core/PlainInput";
import { Select } from "../core/Select";
import { Separator } from "../core/Separator";
import { VStack } from "../core/Stacks";

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
        <Heading>通用</Heading>
        <p className="text-text-subtle">配置更新行为等通用设置。</p>
      </div>
      <CargoFeature feature="updater">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-1">
          <Select
            name="updateChannel"
            label="更新通道"
            labelPosition="left"
            labelClassName="w-[14rem]"
            size="sm"
            value={settings.updateChannel}
            onChange={(updateChannel) => patchModel(settings, { updateChannel })}
            options={[
              { label: "稳定版", value: "stable" },
              { label: "测试版（更新更频繁）", value: "beta" },
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

        <Select
          name="autoupdate"
          value={settings.autoupdate ? "auto" : "manual"}
          label="更新方式"
          labelPosition="left"
          size="sm"
          labelClassName="w-[14rem]"
          onChange={(v) => patchModel(settings, { autoupdate: v === "auto" })}
          options={[
            { label: "自动", value: "auto" },
            { label: "手动", value: "manual" },
          ]}
        />
        <Checkbox
          className="pl-2 mt-1 ml-[14rem]"
          checked={settings.autoDownloadUpdates}
          disabled={!settings.autoupdate}
          help="在后台自动下载 Yaak 更新（约 50MB），以便可立即安装。"
          title="自动下载更新"
          onChange={(autoDownloadUpdates) => patchModel(settings, { autoDownloadUpdates })}
        />

        <Checkbox
          className="pl-2 mt-1 ml-[14rem]"
          checked={settings.checkNotifications}
          title="检查通知"
          help="定期连接 Yaak 服务器检查相关通知。"
          onChange={(checkNotifications) => patchModel(settings, { checkNotifications })}
        />
        <Checkbox
          disabled
          className="pl-2 mt-1 ml-[14rem]"
          checked={false}
          title="发送匿名使用统计"
          help="Yaak 以本地优先为原则，不收集分析或使用数据。"
          onChange={(checkNotifications) => patchModel(settings, { checkNotifications })}
        />
      </CargoFeature>

      <Separator className="my-4" />

      <Heading level={2}>
        工作区{" "}
        <div className="inline-block ml-1 bg-surface-highlight px-2 py-0.5 rounded text text-shrink">
          {workspace.name}
        </div>
      </Heading>
      <VStack className="mt-1 w-full" space={3}>
        <PlainInput
          required
          size="sm"
          name="requestTimeout"
          label="请求超时（毫秒）"
          labelClassName="w-[14rem]"
          placeholder="0"
          labelPosition="left"
          defaultValue={`${workspace.settingRequestTimeout}`}
          validate={(value) => Number.parseInt(value, 10) >= 0}
          onChange={(v) =>
            patchModel(workspace, { settingRequestTimeout: Number.parseInt(v, 10) || 0 })
          }
          type="number"
        />

        <Checkbox
          checked={workspace.settingValidateCertificates}
          help="关闭后将跳过服务端证书校验，适用于自签名证书场景。"
          title="校验 TLS 证书"
          onChange={(settingValidateCertificates) =>
            patchModel(workspace, { settingValidateCertificates })
          }
        />

        <Checkbox
          checked={workspace.settingFollowRedirects}
          title="跟随重定向"
          onChange={(settingFollowRedirects) =>
            patchModel(workspace, {
              settingFollowRedirects,
            })
          }
        />
      </VStack>

      <Separator className="my-4" />

      <Heading level={2}>应用信息</Heading>
      <KeyValueRows>
        <KeyValueRow label="版本">{appInfo.version}</KeyValueRow>
        <KeyValueRow
          label="数据目录"
          rightSlot={
            <IconButton
              title={revealInFinderText}
              icon="folder_open"
              size="2xs"
              onClick={() => revealItemInDir(appInfo.appDataDir)}
            />
          }
        >
          {appInfo.appDataDir}
        </KeyValueRow>
        <KeyValueRow
          label="日志目录"
          rightSlot={
            <IconButton
              title={revealInFinderText}
              icon="folder_open"
              size="2xs"
              onClick={() => revealItemInDir(appInfo.appLogDir)}
            />
          }
        >
          {appInfo.appLogDir}
        </KeyValueRow>
      </KeyValueRows>
    </VStack>
  );
}
