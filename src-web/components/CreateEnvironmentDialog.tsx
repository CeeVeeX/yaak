import { createWorkspaceModel } from "@yaakapp-internal/models";
import { useState } from "react";
import { useToggle } from "../hooks/useToggle";
import { ColorIndicator } from "./ColorIndicator";
import { Button } from "./core/Button";
import { Checkbox } from "./core/Checkbox";
import { ColorPickerWithThemeColors } from "./core/ColorPicker";
import { Label } from "./core/Label";
import { PlainInput } from "./core/PlainInput";

interface Props {
  onCreate: (id: string) => void;
  hide: () => void;
  workspaceId: string;
}

export function CreateEnvironmentDialog({ workspaceId, hide, onCreate }: Props) {
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string | null>(null);
  const [sharable, toggleSharable] = useToggle(false);
  return (
    <form
      className="pb-3 flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const id = await createWorkspaceModel({
          model: "environment",
          name,
          color,
          variables: [],
          public: sharable,
          workspaceId,
          parentModel: "environment",
        });
        hide();
        onCreate(id);
      }}
    >
      <PlainInput
        label="名称"
        required
        defaultValue={name}
        onChange={setName}
        placeholder="生产环境"
      />
      <Checkbox
        checked={sharable}
        title="共享此环境"
        help="可共享环境会包含在数据导出和目录同步中。"
        onChange={toggleSharable}
      />
      <div>
        <Label htmlFor="color" className="mb-1.5" help="为该环境选择激活时显示的颜色，便于识别。">
          颜色
        </Label>
        <ColorPickerWithThemeColors onChange={setColor} color={color} />
      </div>
      <Button type="submit" color="secondary" className="mt-3">
        {color != null && <ColorIndicator color={color} />}
        新建环境
      </Button>
    </form>
  );
}
