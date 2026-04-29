import type { Environment } from "@yaakapp-internal/models";
import { CreateEnvironmentDialog } from "../components/CreateEnvironmentDialog";
import { activeWorkspaceIdAtom } from "../hooks/useActiveWorkspace";
import { createFastMutation } from "../hooks/useFastMutation";
import { showDialog } from "../lib/dialog";
import { jotaiStore } from "../lib/jotai";
import { setWorkspaceSearchParams } from "../lib/setWorkspaceSearchParams";

export const createSubEnvironmentAndActivate = createFastMutation<
  string | null,
  unknown,
  Environment | null
>({
  mutationKey: ["create_environment"],
  mutationFn: async (baseEnvironment) => {
    if (baseEnvironment == null) {
      throw new Error("未传入基础环境");
    }

    const workspaceId = jotaiStore.get(activeWorkspaceIdAtom);
    if (workspaceId == null) {
      throw new Error("当前无活动工作区，无法创建环境");
    }

    return new Promise<string | null>((resolve) => {
      showDialog({
        id: "new-environment",
        title: "新建环境",
        description: "创建多个包含不同变量集的环境",
        size: "sm",
        onClose: () => resolve(null),
        render: ({ hide }) => (
          <CreateEnvironmentDialog
            workspaceId={workspaceId}
            hide={hide}
            onCreate={(id: string) => {
              resolve(id);
            }}
          />
        ),
      });
    });
  },
  onSuccess: async (environmentId) => {
    if (environmentId == null) {
      return; // Was not created
    }

    setWorkspaceSearchParams({ environment_id: environmentId });
  },
});
