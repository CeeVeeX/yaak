import type { DnsOverride, Workspace } from "@yaakapp-internal/models";
import { patchModel } from "@yaakapp-internal/models";
import { useCallback, useId, useMemo } from "react";
import { fireAndForget } from "../lib/fireAndForget";
import { Button } from "./core/Button";
import { Checkbox } from "./core/Checkbox";
import { IconButton } from "./core/IconButton";
import { PlainInput } from "./core/PlainInput";
import { HStack, VStack } from "./core/Stacks";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "./core/Table";

interface Props {
  workspace: Workspace;
}

interface DnsOverrideWithId extends DnsOverride {
  _id: string;
}

export function DnsOverridesEditor({ workspace }: Props) {
  const reactId = useId();

  // Ensure each override has an internal ID for React keys
  const overridesWithIds = useMemo<DnsOverrideWithId[]>(() => {
    return workspace.settingDnsOverrides.map((override, index) => ({
      ...override,
      _id: `${reactId}-${index}`,
    }));
  }, [workspace.settingDnsOverrides, reactId]);

  const handleChange = useCallback(
    (overrides: DnsOverride[]) => {
      fireAndForget(patchModel(workspace, { settingDnsOverrides: overrides }));
    },
    [workspace],
  );

  const handleAdd = useCallback(() => {
    const newOverride: DnsOverride = {
      hostname: "",
      ipv4: [""],
      ipv6: [],
      enabled: true,
    };
    handleChange([...workspace.settingDnsOverrides, newOverride]);
  }, [workspace.settingDnsOverrides, handleChange]);

  const handleUpdate = useCallback(
    (index: number, update: Partial<DnsOverride>) => {
      const updated = workspace.settingDnsOverrides.map((o, i) =>
        i === index ? { ...o, ...update } : o,
      );
      handleChange(updated);
    },
    [workspace.settingDnsOverrides, handleChange],
  );

  const handleDelete = useCallback(
    (index: number) => {
      const updated = workspace.settingDnsOverrides.filter((_, i) => i !== index);
      handleChange(updated);
    },
    [workspace.settingDnsOverrides, handleChange],
  );

  return (
    <VStack space={3} className="pb-3">
      <div className="text-text-subtle text-sm">
        为指定主机名覆盖 DNS 解析。其效果类似{" "}
        <code className="text-text-subtlest bg-surface-highlight px-1 rounded">/etc/hosts</code>，
        但仅作用于当前工作区发出的请求。
      </div>

      {overridesWithIds.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell className="w-8" />
              <TableHeaderCell>主机名</TableHeaderCell>
              <TableHeaderCell>IPv4 地址</TableHeaderCell>
              <TableHeaderCell>IPv6 地址</TableHeaderCell>
              <TableHeaderCell className="w-10" />
            </TableRow>
          </TableHead>
          <TableBody>
            {overridesWithIds.map((override, index) => (
              <DnsOverrideRow
                key={override._id}
                override={override}
                onUpdate={(update) => handleUpdate(index, update)}
                onDelete={() => handleDelete(index)}
              />
            ))}
          </TableBody>
        </Table>
      )}

      <HStack>
        <Button size="xs" color="secondary" variant="border" onClick={handleAdd}>
          添加 DNS 覆盖
        </Button>
      </HStack>
    </VStack>
  );
}

interface DnsOverrideRowProps {
  override: DnsOverride;
  onUpdate: (update: Partial<DnsOverride>) => void;
  onDelete: () => void;
}

function DnsOverrideRow({ override, onUpdate, onDelete }: DnsOverrideRowProps) {
  const ipv4Value = override.ipv4.join(", ");
  const ipv6Value = override.ipv6.join(", ");

  return (
    <TableRow>
      <TableCell>
        <Checkbox
          hideLabel
          title={override.enabled ? "禁用覆盖" : "启用覆盖"}
          checked={override.enabled ?? true}
          onChange={(enabled) => onUpdate({ enabled })}
        />
      </TableCell>
      <TableCell>
        <PlainInput
          size="sm"
          hideLabel
          label="主机名"
          placeholder="api.example.com"
          defaultValue={override.hostname}
          onChange={(hostname) => onUpdate({ hostname })}
        />
      </TableCell>
      <TableCell>
        <PlainInput
          size="sm"
          hideLabel
          label="IPv4 地址"
          placeholder="127.0.0.1"
          defaultValue={ipv4Value}
          onChange={(value) =>
            onUpdate({
              ipv4: value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </TableCell>
      <TableCell>
        <PlainInput
          size="sm"
          hideLabel
          label="IPv6 地址"
          placeholder="::1"
          defaultValue={ipv6Value}
          onChange={(value) =>
            onUpdate({
              ipv6: value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </TableCell>
      <TableCell>
        <IconButton size="xs" iconSize="sm" icon="trash" title="删除覆盖项" onClick={onDelete} />
      </TableCell>
    </TableRow>
  );
}
