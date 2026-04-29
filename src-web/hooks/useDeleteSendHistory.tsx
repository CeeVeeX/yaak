import {
  grpcConnectionsAtom,
  httpResponsesAtom,
  websocketConnectionsAtom,
} from "@yaakapp-internal/models";
import { useAtomValue } from "jotai";
import { showAlert } from "../lib/alert";
import { showConfirmDelete } from "../lib/confirm";
import { jotaiStore } from "../lib/jotai";
import { pluralizeCount } from "../lib/pluralize";
import { invokeCmd } from "../lib/tauri";
import { activeWorkspaceIdAtom } from "./useActiveWorkspace";
import { useFastMutation } from "./useFastMutation";

export function useDeleteSendHistory() {
  const httpResponses = useAtomValue(httpResponsesAtom);
  const grpcConnections = useAtomValue(grpcConnectionsAtom);
  const websocketConnections = useAtomValue(websocketConnectionsAtom);

  const labels = [
    httpResponses.length > 0 ? pluralizeCount("HTTP 响应", httpResponses.length) : null,
    grpcConnections.length > 0 ? pluralizeCount("gRPC 连接", grpcConnections.length) : null,
    websocketConnections.length > 0
      ? pluralizeCount("WebSocket 连接", websocketConnections.length)
      : null,
  ].filter((l) => l != null);

  return useFastMutation({
    mutationKey: ["delete_send_history", labels],
    mutationFn: async () => {
      if (labels.length === 0) {
        showAlert({
          id: "no-responses",
          title: "没有可删除项",
          body: "当前没有 HTTP、gRPC 或 WebSocket 历史记录",
        });
        return;
      }

      const confirmed = await showConfirmDelete({
        id: "delete-send-history",
        title: "清空发送历史",
        description: <>删除 {labels.join("、")}？</>,
      });
      if (!confirmed) return false;

      const workspaceId = jotaiStore.get(activeWorkspaceIdAtom);
      await invokeCmd("cmd_delete_send_history", { workspaceId });
      return true;
    },
  });
}
