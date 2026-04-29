import { patchModel, settingsAtom } from "@yaakapp-internal/models";
import { useAtomValue } from "jotai";

import { Checkbox } from "../core/Checkbox";
import { Heading } from "../core/Heading";
import { InlineCode } from "../core/InlineCode";
import { PlainInput } from "../core/PlainInput";
import { Select } from "../core/Select";
import { Separator } from "../core/Separator";
import { HStack, VStack } from "../core/Stacks";

export function SettingsProxy() {
  const settings = useAtomValue(settingsAtom);

  return (
    <VStack space={1.5} className="mb-4">
      <div className="mb-3">
        <Heading>代理</Heading>
        <p className="text-text-subtle">
          为 HTTP 请求配置代理服务器。适用于企业防火墙、流量调试或经特定网络基础设施转发。
        </p>
      </div>
      <Select
        name="proxy"
        label="代理"
        hideLabel
        size="sm"
        value={settings.proxy?.type ?? "automatic"}
        onChange={async (v) => {
          if (v === "automatic") {
            await patchModel(settings, { proxy: undefined });
          } else if (v === "enabled") {
            await patchModel(settings, {
              proxy: {
                disabled: false,
                type: "enabled",
                http: "",
                https: "",
                auth: { user: "", password: "" },
                bypass: "",
              },
            });
          } else {
            await patchModel(settings, { proxy: { type: "disabled" } });
          }
        }}
        options={[
          { label: "自动检测代理", value: "automatic" },
          { label: "自定义代理配置", value: "enabled" },
          { label: "不使用代理", value: "disabled" },
        ]}
      />
      {settings.proxy?.type === "enabled" && (
        <VStack space={1.5}>
          <Checkbox
            className="my-3"
            checked={!settings.proxy.disabled}
            title="启用代理"
            help="可临时禁用代理而不丢失配置"
            onChange={async (enabled) => {
              const { proxy } = settings;
              const http = proxy?.type === "enabled" ? proxy.http : "";
              const https = proxy?.type === "enabled" ? proxy.https : "";
              const bypass = proxy?.type === "enabled" ? proxy.bypass : "";
              const auth = proxy?.type === "enabled" ? proxy.auth : null;
              const disabled = !enabled;
              await patchModel(settings, {
                proxy: { type: "enabled", http, https, auth, disabled, bypass },
              });
            }}
          />
          <HStack space={1.5}>
            <PlainInput
              size="sm"
              label={
                <>
                  <InlineCode>http://</InlineCode> 流量代理
                </>
              }
              placeholder="localhost:9090"
              defaultValue={settings.proxy?.http}
              onChange={async (http) => {
                const { proxy } = settings;
                const https = proxy?.type === "enabled" ? proxy.https : "";
                const bypass = proxy?.type === "enabled" ? proxy.bypass : "";
                const auth = proxy?.type === "enabled" ? proxy.auth : null;
                const disabled = proxy?.type === "enabled" ? proxy.disabled : false;
                await patchModel(settings, {
                  proxy: {
                    type: "enabled",
                    http,
                    https,
                    auth,
                    disabled,
                    bypass,
                  },
                });
              }}
            />
            <PlainInput
              size="sm"
              label={
                <>
                  <InlineCode>https://</InlineCode> 流量代理
                </>
              }
              placeholder="localhost:9090"
              defaultValue={settings.proxy?.https}
              onChange={async (https) => {
                const { proxy } = settings;
                const http = proxy?.type === "enabled" ? proxy.http : "";
                const bypass = proxy?.type === "enabled" ? proxy.bypass : "";
                const auth = proxy?.type === "enabled" ? proxy.auth : null;
                const disabled = proxy?.type === "enabled" ? proxy.disabled : false;
                await patchModel(settings, {
                  proxy: { type: "enabled", http, https, auth, disabled, bypass },
                });
              }}
            />
          </HStack>
          <Separator className="my-6" />
          <Checkbox
            checked={settings.proxy.auth != null}
            title="启用身份验证"
            onChange={async (enabled) => {
              const { proxy } = settings;
              const http = proxy?.type === "enabled" ? proxy.http : "";
              const https = proxy?.type === "enabled" ? proxy.https : "";
              const disabled = proxy?.type === "enabled" ? proxy.disabled : false;
              const bypass = proxy?.type === "enabled" ? proxy.bypass : "";
              const auth = enabled ? { user: "", password: "" } : null;
              await patchModel(settings, {
                proxy: { type: "enabled", http, https, auth, disabled, bypass },
              });
            }}
          />

          {settings.proxy.auth != null && (
            <HStack space={1.5}>
              <PlainInput
                required
                size="sm"
                label="用户名"
                placeholder="myUser"
                defaultValue={settings.proxy.auth.user}
                onChange={async (user) => {
                  const { proxy } = settings;
                  const http = proxy?.type === "enabled" ? proxy.http : "";
                  const https = proxy?.type === "enabled" ? proxy.https : "";
                  const disabled = proxy?.type === "enabled" ? proxy.disabled : false;
                  const bypass = proxy?.type === "enabled" ? proxy.bypass : "";
                  const password = proxy?.type === "enabled" ? (proxy.auth?.password ?? "") : "";
                  const auth = { user, password };
                  await patchModel(settings, {
                    proxy: { type: "enabled", http, https, auth, disabled, bypass },
                  });
                }}
              />
              <PlainInput
                size="sm"
                label="密码"
                type="password"
                placeholder="s3cretPassw0rd"
                defaultValue={settings.proxy.auth.password}
                onChange={async (password) => {
                  const { proxy } = settings;
                  const http = proxy?.type === "enabled" ? proxy.http : "";
                  const https = proxy?.type === "enabled" ? proxy.https : "";
                  const disabled = proxy?.type === "enabled" ? proxy.disabled : false;
                  const bypass = proxy?.type === "enabled" ? proxy.bypass : "";
                  const user = proxy?.type === "enabled" ? (proxy.auth?.user ?? "") : "";
                  const auth = { user, password };
                  await patchModel(settings, {
                    proxy: { type: "enabled", http, https, auth, disabled, bypass },
                  });
                }}
              />
            </HStack>
          )}
          {settings.proxy.type === "enabled" && (
            <>
              <Separator className="my-6" />
              <PlainInput
                label="Proxy Bypass"
                help="Comma-separated list to bypass the proxy."
                defaultValue={settings.proxy.bypass}
                placeholder="127.0.0.1, *.example.com, localhost:3000"
                onChange={async (bypass) => {
                  const { proxy } = settings;
                  const http = proxy?.type === "enabled" ? proxy.http : "";
                  const https = proxy?.type === "enabled" ? proxy.https : "";
                  const disabled = proxy?.type === "enabled" ? proxy.disabled : false;
                  const user = proxy?.type === "enabled" ? (proxy.auth?.user ?? "") : "";
                  const password = proxy?.type === "enabled" ? (proxy.auth?.password ?? "") : "";
                  const auth = { user, password };
                  await patchModel(settings, {
                    proxy: { type: "enabled", http, https, auth, disabled, bypass },
                  });
                }}
              />
            </>
          )}
        </VStack>
      )}
    </VStack>
  );
}
