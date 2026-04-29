import { createWorkspaceModel } from "@yaakapp-internal/models";
import { jotaiStore } from "../lib/jotai";
import { showPrompt } from "../lib/prompt";
import { setWorkspaceSearchParams } from "../lib/setWorkspaceSearchParams";
import { activeWorkspaceIdAtom } from "./useActiveWorkspace";
import { useFastMutation } from "./useFastMutation";

export function useCreateCookieJar() {
  return useFastMutation({
    mutationKey: ["create_cookie_jar"],
    mutationFn: async () => {
      const workspaceId = jotaiStore.get(activeWorkspaceIdAtom);
      if (workspaceId == null) {
        throw new Error("当前无活动工作区，无法创建 Cookie Jar");
      }

      const name = await showPrompt({
        id: "new-cookie-jar",
        title: "新建 Cookie Jar",
        placeholder: "我的 Jar",
        confirmText: "创建",
        label: "名称",
        defaultValue: "我的 Jar",
      });
      if (name == null) return null;

      return createWorkspaceModel({ model: "cookie_jar", workspaceId, name });
    },
    onSuccess: async (cookieJarId) => {
      setWorkspaceSearchParams({ cookie_jar_id: cookieJarId });
    },
  });
}
