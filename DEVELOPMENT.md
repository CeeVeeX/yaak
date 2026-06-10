# 开发环境配置

Yaak 是一个结合了 **Node.js** 和 **Rust** 的 Monorepo 项目。它基于 Tauri 构建，因此主应用使用 Rust 与 HTML/CSS/JavaScript 开发。此外，项目还包含一个插件系统，该系统由一个 Node.js Sidecar 驱动，并通过 gRPC 与应用程序通信。

由于涉及多个组件，在开始开发之前需要完成一些初始化步骤。

## 前置条件

请确保已安装以下工具：

- Node.js（v24 及以上）
- Rust
- Vite+（`vp` 命令行工具）

使用以下命令检查安装是否成功：

```shell
node -v
npm -v
vp --version
rustc --version
```

安装项目依赖：

```shell
npm install
```

运行 `bootstrap` 命令完成初始化配置：

```shell
npm run bootstrap
```

## 启动应用

完成初始化后，以开发模式启动应用：

```shell
# 启动前端页面服务
npm run client:tauri-before-dev

# 启动 Tauri 应用
npm run client:dev
```

## SQLite 数据库迁移

可以在 `src-tauri/` 目录下创建新的迁移文件：

```shell
npm run migration
```

创建迁移后，重新启动应用即可自动应用这些迁移。

> 注意：为了安全起见，开发环境使用的数据库路径与生产环境不同。

## Lezer 语法生成

```sh
# 示例
lezer-generator components/core/Editor/<LANG>/<LANG>.grammar > components/core/Editor/<LANG>/<LANG>.ts
```

其中 `<LANG>` 替换为对应语言名称。

## 代码检查与格式化

该仓库使用 Vite+ 提供的工具进行代码检查（oxlint）和代码格式化（oxfmt）。

### 检查整个仓库

```sh
npm run lint
```

### 格式化代码

```sh
npm run format
```

### 说明

- Git 提交前的 Hook 会自动执行 `vp lint`。
- 部分工作区（workspace）包还会运行 `tsc --noEmit` 进行 TypeScript 类型检查。
- 使用 VS Code 的开发者建议安装项目推荐的扩展，以获得保存时自动格式化（Format on Save）支持。
