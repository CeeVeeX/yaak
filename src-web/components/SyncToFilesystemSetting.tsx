import { readDir } from "@tauri-apps/plugin-fs";
import { useState } from "react";
import { openWorkspaceFromSyncDir } from "../commands/openWorkspaceFromSyncDir";
import { Banner } from "./core/Banner";
import { Button } from "./core/Button";
import { Checkbox } from "./core/Checkbox";
import { VStack } from "./core/Stacks";
import { SelectFile } from "./SelectFile";

export interface SyncToFilesystemSettingProps {
  onChange: (args: { filePath: string | null; initGit?: boolean }) => void;
  onCreateNewWorkspace: () => void;
  value: { filePath: string | null; initGit?: boolean };
}

export function SyncToFilesystemSetting({
  onChange,
  onCreateNewWorkspace,
  value,
}: SyncToFilesystemSettingProps) {
  const [syncDir, setSyncDir] = useState<string | null>(null);
  return (
    <VStack className="w-full my-2" space={3}>
      {syncDir && (
        <Banner color="notice" className="flex flex-col gap-1.5">
          <p>目录不为空。是否改为打开它？</p>
          <div>
            <Button
              variant="border"
              color="notice"
              size="xs"
              type="button"
              onClick={() => {
                openWorkspaceFromSyncDir.mutate(syncDir);
                onCreateNewWorkspace();
              }}
            >
              打开工作区
            </Button>
          </div>
        </Banner>
      )}

      <SelectFile
        directory
        label="本地文件夹同步"
        size="xs"
        noun="文件夹"
        help="将数据同步到文件夹以进行备份和 Git 集成"
        filePath={value.filePath}
        onChange={async ({ filePath }) => {
          if (filePath != null) {
            const files = await readDir(filePath);
            if (files.length > 0) {
              setSyncDir(filePath);
              return;
            }
          }

          setSyncDir(null);
          onChange({ ...value, filePath });
        }}
      />

      {value.filePath && typeof value.initGit === "boolean" && (
        <Checkbox
          checked={value.initGit}
          onChange={(initGit) => onChange({ ...value, initGit })}
          title="初始化 Git 仓库"
        />
      )}
    </VStack>
  );
}
