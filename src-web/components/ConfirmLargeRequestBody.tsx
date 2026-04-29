import type { HttpRequest } from "@yaakapp-internal/models";
import { patchModel } from "@yaakapp-internal/models";
import type { ReactNode } from "react";
import { useToggle } from "../hooks/useToggle";
import { showConfirm } from "../lib/confirm";
import { Banner } from "./core/Banner";
import { Button } from "./core/Button";
import { InlineCode } from "./core/InlineCode";
import { Link } from "./core/Link";
import { SizeTag } from "./core/SizeTag";
import { HStack } from "./core/Stacks";

interface Props {
  children: ReactNode;
  request: HttpRequest;
}

const LARGE_TEXT_BYTES = 2 * 1000 * 1000;

export function ConfirmLargeRequestBody({ children, request }: Props) {
  const [showLargeResponse, toggleShowLargeResponse] = useToggle();

  if (request.body?.text == null) {
    return children;
  }

  const contentLength = request.body.text.length ?? 0;
  const tooLargeBytes = LARGE_TEXT_BYTES;
  const isLarge = contentLength > tooLargeBytes;
  if (!showLargeResponse && isLarge) {
    return (
      <Banner color="primary" className="flex flex-col gap-3">
        <p>
          渲染超过{" "}
          <InlineCode>
            <SizeTag contentLength={tooLargeBytes} />
          </InlineCode>{" "}
          的内容可能影响性能。
        </p>
        <p>
          详见{" "}
          <Link href="https://feedback.yaak.app/en/help/articles/1198684-working-with-large-values">
            处理大体量内容
          </Link>{" "}
          获取建议。
        </p>
        <HStack wrap space={2}>
          <Button color="primary" size="xs" onClick={toggleShowLargeResponse}>
            显示请求体
          </Button>
          <Button
            color="danger"
            size="xs"
            variant="border"
            onClick={async () => {
              const confirm = await showConfirm({
                id: `delete-body-${request.id}`,
                confirmText: "删除请求体",
                title: "删除请求体文本",
                description: "确定要删除请求体文本吗？",
                color: "danger",
              });
              if (confirm) {
                await patchModel(request, { body: { ...request.body, text: "" } });
              }
            }}
          >
            删除请求体
          </Button>
        </HStack>
      </Banner>
    );
  }

  return <>{children}</>;
}
